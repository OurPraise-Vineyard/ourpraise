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

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.pdf = functions.https.onRequest((request, response) => {
  const { event, song, transpose = 0 } = request.query

  function getSongs () {
    if (event) {
      return db.collection('songs').get()
        .then((snap) => snap.docs.map(doc => ({
          ...doc.data(),
          transpose: 0
        })))
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
