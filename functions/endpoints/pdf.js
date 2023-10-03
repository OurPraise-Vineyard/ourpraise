const functions = require('firebase-functions')
const { getFirestore } = require('firebase-admin/firestore')
const pdf = require('html-pdf')
const createHtml = require('../utils/createHtml')

const db = getFirestore()

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

  function getEvent () {
    if (eventId) {
      return db.doc(`events/${eventId}`).get()
    }
    return Promise.resolve(null)
  }

  function getSongs (event) {
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
