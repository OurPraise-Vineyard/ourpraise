const functions = require('firebase-functions')
const { getFirestore } = require('firebase-admin/firestore')
const express = require('express')
const cors = require('cors')
const { getEvent, getSong } = require('../utils/firestore')

const app = express()
const db = getFirestore()

app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: true }))

app.get('/song', (req, res) => {
  const { id } = req.query

  if (!id) {
    res.status(400).json({
      status: 400,
      error: 'Missing song id in query'
    })
  }

  getSong(db, id).then(data => {
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

  getEvent(db, id).then(data => {
    res.json(data)
  })
})

app.get('/events', (req, res) => {
  function getOrganisations() {
    return db
      .collection('organisations')
      .get()
      .then(snap =>
        snap.docs.reduce(
          (acc, doc) => ({
            ...acc,
            [doc.id]: doc.data().name
          }),
          {}
        )
      )
  }

  function getEvents(organisations) {
    return db
      .collection('events')
      .orderBy('date', 'desc')
      .get()
      .then(snap =>
        snap.docs.map(doc => {
          const ev = doc.data()
          return {
            id: doc.id,
            organisationName: organisations[ev.organisation],
            title: ev.title,
            date: ev.date,
            songs: ev.songs.length
          }
        })
      )
  }

  getOrganisations()
    .then(getEvents)
    .then(events => {
      res.json(events)
    })
})

exports.app = functions.region('europe-west1').https.onRequest(app)
