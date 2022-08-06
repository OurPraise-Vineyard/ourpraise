const functions = require('firebase-functions')
const admin = require('firebase-admin')
const pdf = require('html-pdf')

const app = admin.initializeApp()

const db = app.firestore()

const createHtml = require('./createHtml')
const options = {
  format: 'A4',
  border: {
    top: '0.5in',
    bottom: '0.7in',
    left: '0.7in',
    right: '0.7in'
  }
}

exports.pdf = functions.region('europe-west1').https.onRequest((request, response) => {
  const { event, song, transpose = 0 } = request.query

  function getSongs () {
    if (event) {
      return db.doc(`events/${event}`).get()
        .then((doc) => Promise.all(doc.data().songs.map(song =>
          db.doc(`songs/${song.id}`)
            .get()
            .then(doc => ({
              ...doc.data(),
              transpose: song.transpose
            }))
        )))
    } else if (song) {
      return db.doc(`songs/${song}`).get()
        .then((doc) => [{
          ...doc.data(),
          transpose: parseInt(transpose, 10)
        }])
    }
  }

  getSongs().then(songs => {
      const html = createHtml(songs)

      pdf.create(html, options).toBuffer(function(err, buffer) {
        if (err) {
          console.error(err)
          return response.sendStatus(500)
        }
        response.setHeader('content-type', 'application/pdf')
        response.send(buffer)
      })
    })
})

exports.slides = functions.region('europe-west1').https.onRequest((request, response) => {
  const { event, song } = request.query

  function getSongs () {
    if (event) {
      return db.doc(`events/${event}`).get()
        .then((doc) => Promise.all(doc.data().songs.map(song =>
          db.doc(`songs/${song.id}`)
            .get()
            .then(doc => ({
              title: doc.data().title,
              authors: doc.data().authors,
              body: doc.data().body
            }))
        )))
    } else if (song) {
      return db.doc(`songs/${song}`).get()
        .then((doc) => [{
          title: doc.data().title,
          authors: doc.data().authors,
          body: doc.data().body
        }])
    }
  }

  getSongs()
    .then(songs => {
      return songs.map(({ body, ...song }) => ({
        ...song,
        slides: body
          .replace(/\n\s+\n/g, '\n\n')
          .split('\n\n')
          .map(part => part.replace(/\/\/.*(\n|$)/g, ''))
          .filter(Boolean)
      }))
    })
    .then(songs => {
      response.setHeader('content-type', 'application/json')
      response.send(songs)
    })
})

exports.onWriteEvent = functions.region('europe-west1').firestore
  .document('events/{eventId}')
  .onWrite(async (change) => {
    if (change.after.exists) {
      if (change.before.exists) { // Update
        const prevSongs = change.before.data().songs
        const nextSongs = change.after.data().songs

        const added = nextSongs.filter(({ id: idA }) => prevSongs.findIndex(({ id: idB }) => idA === idB) === -1)
        const removed = prevSongs.filter(({ id: idA }) => nextSongs.findIndex(({ id: idB }) => idA === idB) === -1)

        console.log(added)
        console.log(removed)

        await Promise.all(added.map(song =>
          db.doc(`songs/${song.id}`).update({
            popularity: admin.firestore.FieldValue.increment(1)
          })
        ))

        await Promise.all(removed.map(song =>
          db.doc(`songs/${song.id}`).update({
            popularity: admin.firestore.FieldValue.increment(-1)
          })
        ))
      } else { // Create
        const songs = change.after.data().songs

        await Promise.all(songs.map(song =>
          db.doc(`songs/${song.id}`).update({
            popularity: admin.firestore.FieldValue.increment(1)
          })
        ))
      }
    } else { // Delete
      const prevSongs = change.before.data().songs

      await Promise.all(prevSongs.map(song =>
        db.doc(`songs/${song.id}`).update({
          popularity: admin.firestore.FieldValue.increment(-1)
        })
      ))
    }
  })

exports.onWriteOrganisation = functions.region('europe-west1').firestore
  .document('organisations/{id}')
  .onUpdate(async change => {
    const addedMembers = change.after.data().members.filter(member => change.before.data().members.indexOf(member) === -1)
    if (addedMembers.length > 0) {
      const orgName = change.after.data().name
      await Promise.all(addedMembers.map(async member => {
        if (!(await admin.auth().getUserByEmail(member).then(() => true).catch(() => false))) {
          await db.collection('mail').add({
            to: member,
            message: {
              subject: `Invitation to join ${orgName} on OurPraise`,
              html: `Hi 👋<br><br>You've been invited to join ${orgName} on OurPraise. Sign up today by using the link below:<br><a href="https://ourpraise.dk/register?email=${member}">Click here to register.</a><br><br>Best regards,<br>The OurPraise Team.`
            }
          })
        }
      }))
    }
  })

