const functions = require('firebase-functions')
const { getFirestore } = require('firebase-admin/firestore')
const express = require('express')
const cors = require('cors')
const { getEvent, getSong } = require('../utils/firestore')
const { searchSongs } = require('../utils/algolia')

const app = express()
const db = getFirestore()

app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: true }))

app.get('/search', (req, res) => {
  const { q } = req.query

  const searchQuery = q.trim()

  if (!searchQuery) {
    res.status(400).json({
      status: 400,
      error: 'Missing search query string'
    })
  }

  searchSongs(searchQuery).then(data => {
    res.json({
      hits: data,
      query: searchQuery
    })
  })
})

app.get('/song', (req, res) => {
  const { id } = req.query

  if (!id) {
    res.status(400).json({
      status: 400,
      error: 'Missing song id in query'
    })
  }

  getSong(id).then(data => {
    res.json(data)
  })
})

app.get('/event', (req, res) => {
  const { id } = req.query

  if (!id) {
    res.status(400).json({
      status: 400,
      error: 'Missing event id in query'
    })
  }

  getEvent(id).then(data => {
    res.json(data)
  })
})

app.get('/events', (req, res) => {
  db.collection('events')
    .orderBy('date', 'desc')
    .limit(20)
    .get()
    .then(snap =>
      snap.docs.map(doc => {
        const ev = doc.data()
        return {
          id: doc.id,
          title: ev.title,
          date: ev.date,
          songs: ev.songs.length
        }
      })
    )
    .then(events => {
      res.json(events)
    })
})

exports.app = functions.region('europe-west1').https.onRequest(app)
