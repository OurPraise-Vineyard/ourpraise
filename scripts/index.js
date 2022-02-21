const admin = require('firebase-admin')
const token = require('/home/gustav/Downloads/songdriver-firebase-firebase-adminsdk-899w5-f66e749a07.json')
const fs = require('fs-extra')
const path = require('path')

const app = admin.initializeApp({
  credential: admin.credential.cert(token)
})

const db = app.firestore();

(async function () {
  const songs = (await db.collection('songs').get()).docs.map(doc => ({
    objectID: doc.id,
    authors: doc.data().authors,
    title: doc.data().title
  }))

  await fs.writeJson(path.resolve(__dirname, 'songs.json'), songs)
})()
