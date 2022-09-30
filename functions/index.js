const functions = require('firebase-functions')
const { initializeApp } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')
const pdf = require('html-pdf')

initializeApp()

const db = getFirestore()

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

exports.pdf = functions.region('europe-west1').https.onRequest(async (request, response) => {
  const { event: eventId, song: songId, transpose = 0, debug } = request.query

  function getEvent() {
    if (eventId) {
      return db
        .doc(`events/${eventId}`)
        .get()
        .then(doc => {
          const data = doc.data()
          return db
            .doc(`organisations/${data.organisation}`)
            .get()
            .then(doc => ({
              ...data,
              organisation: doc.data()
            }))
        })
    }
    return Promise.resolve(null)
  }

  function getSongs(event) {
    if (event) {
      return Promise.all(
        event.songs.map(song =>
          db
            .doc(`songs/${song.id}`)
            .get()
            .then(doc =>
              doc.exists
                ? {
                    ...doc.data(),
                    transpose: song.transpose,
                    comment: song.comment
                  }
                : null
            )
        )
      ).then(songs => songs.filter(Boolean))
    } else if (songId) {
      return db
        .doc(`songs/${songId}`)
        .get()
        .then(doc => [
          {
            ...doc.data(),
            transpose: parseInt(transpose, 10)
          }
        ])
    }
  }

  const event = await getEvent()
  const songs = await getSongs(event)

  const html = createHtml(songs, event)

  if (debug) {
    response.setHeader('content-type', 'text/html')
    response.send(html)
  } else {
    pdf.create(html, options).toBuffer(function (err, buffer) {
      if (err) {
        console.error(err)
        return response.sendStatus(500)
      }
      response.setHeader('content-type', 'application/pdf')
      response.send(buffer)
    })
  }
})

exports.slides = functions.region('europe-west1').https.onRequest((request, response) => {
  const { event, song } = request.query

  function getSongs() {
    if (event) {
      return db
        .doc(`events/${event}`)
        .get()
        .then(doc =>
          Promise.all(
            doc.data().songs.map(song =>
              db
                .doc(`songs/${song.id}`)
                .get()
                .then(doc =>
                  doc.exists
                    ? {
                        title: doc.data().title,
                        authors: doc.data().authors,
                        body: doc.data().body
                      }
                    : null
                )
            )
          ).then(songs => songs.filter(Boolean))
        )
    } else if (song) {
      return db
        .doc(`songs/${song}`)
        .get()
        .then(doc => [
          {
            title: doc.data().title,
            authors: doc.data().authors,
            body: doc.data().body
          }
        ])
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

exports.onWriteEvent = functions
  .region('europe-west1')
  .firestore.document('events/{eventId}')
  .onWrite(async change => {
    if (change.after.exists) {
      if (change.before.exists) {
        // Update
        const prevSongs = change.before.data().songs
        const nextSongs = change.after.data().songs

        const added = nextSongs.filter(
          ({ id: idA }) => prevSongs.findIndex(({ id: idB }) => idA === idB) === -1
        )
        const removed = prevSongs.filter(
          ({ id: idA }) => nextSongs.findIndex(({ id: idB }) => idA === idB) === -1
        )

        await Promise.all(
          added.map(song =>
            db.doc(`songs/${song.id}`).update({
              popularity: FieldValue.increment(1)
            })
          )
        )

        await Promise.all(
          removed.map(song =>
            db.doc(`songs/${song.id}`).update({
              popularity: FieldValue.increment(-1)
            })
          )
        )
      } else {
        // Create
        const songs = change.after.data().songs

        await Promise.all(
          songs.map(song =>
            db.doc(`songs/${song.id}`).update({
              popularity: FieldValue.increment(1)
            })
          )
        )
      }
    } else {
      // Delete
      const prevSongs = change.before.data().songs

      await Promise.all(
        prevSongs.map(song =>
          db.doc(`songs/${song.id}`).update({
            popularity: FieldValue.increment(-1)
          })
        )
      )
    }
  })

function handleAddedMembers(org, members) {
  const orgName = org.name
  return Promise.all(
    members.map(async member => {
      if (
        !(await getAuth()
          .getUserByEmail(member)
          .then(() => true)
          .catch(() => false))
      ) {
        await db.collection('mail').add({
          to: member,
          message: {
            subject: `Invitation to join ${orgName} on OurPraise`,
            html: `Hi 👋<br><br>You've been invited to join ${orgName} on OurPraise. Sign up today by using the link below:<br><a href="https://ourpraise.dk/register?email=${member}">Click here to register.</a><br><br>Best regards,<br>The OurPraise Team.`
          }
        })
      }

      await db.runTransaction(transaction =>
        transaction.get(db.doc(`users/${member}`)).then(doc => {
          let orgs = []
          if (doc.exists) {
            orgs = doc.data().organisations
          }

          orgs.push(org.id)

          transaction.set(doc.ref, { organisations: orgs }, { merge: true })
        })
      )
    })
  )
}

function handleRemovedMembers(org, members) {
  return Promise.all(
    members.map(async member => {
      await db.runTransaction(transaction =>
        transaction.get(db.doc(`users/${member}`)).then(doc => {
          if (doc.exists) {
            const orgs = doc.data().organisations

            orgs.splice(orgs.indexOf(org.id), 1)

            if (orgs.length === 0) {
              transaction.delete(doc.ref)
            } else {
              transaction.set(doc.ref, { organisations: orgs }, { merge: true })
            }
          }
        })
      )
    })
  )
}

exports.onUpdateOrganisation = functions
  .region('europe-west1')
  .firestore.document('organisations/{id}')
  .onUpdate(async change => {
    const addedMembers = change.after
      .data()
      .members.filter(member => change.before.data().members.indexOf(member) === -1)
    const removedMembers = change.before
      .data()
      .members.filter(member => change.after.data().members.indexOf(member) === -1)

    const org = {
      ...change.after.data(),
      id: change.after.id
    }

    if (addedMembers.length > 0) {
      await handleAddedMembers(org, addedMembers)
    }

    if (removedMembers.length > 0) {
      await handleRemovedMembers(org, removedMembers)
    }
  })

exports.onDeleteOrganisation = functions
  .region('europe-west1')
  .firestore.document('organisations/{id}')
  .onDelete(async before => {
    const org = {
      ...before.data(),
      id: before.id
    }
    await handleRemovedMembers(org, org.members)
  })

exports.onCreaterganisation = functions
  .region('europe-west1')
  .firestore.document('organisations/{id}')
  .onCreate(async after => {
    const org = {
      ...after.data(),
      id: after.id
    }
    await handleAddedMembers(org, org.members)
  })
