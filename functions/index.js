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
          .map(part => part.replace(/\/\/.*\n/g, ''))
      }))
    })
    .then(songs => {
      response.setHeader('content-type', 'application/json')
      response.send(songs)
    })
})
