const functions = require('firebase-functions')
const { getFirestore } = require('firebase-admin/firestore')

const db = getFirestore()

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

exports.events = functions.region('europe-west1').https.onRequest((request, response) => {
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
      response.setHeader('content-type', 'application/json')
      response.send(events)
    })
})
