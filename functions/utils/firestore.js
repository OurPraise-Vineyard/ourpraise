const { getFirestore } = require('firebase-admin/firestore')

const db = getFirestore()

const getSong = async id => {
  const doc = await db.doc(`songs/${id}`).get()

  if (!doc.exists) return null

  return {
    id,
    title: doc.data().title,
    authors: doc.data().authors,
    slides: doc
      .data()
      .body.replace(/\n\s+\n/g, '\n\n')
      .split('\n\n')
      .map(part => part.replace(/\/\/.*(\n|$)/g, ''))
      .filter(Boolean)
  }
}

exports.getEvent = async id => {
  const doc = await db.doc(`events/${id}`).get()

  if (!doc.exists) return null

  const songs = await Promise.all(
    doc.data().songs.map(async song => {
      return await getSong(song.id)
    })
  )

  return {
    id,
    title: doc.data().title,
    songs
  }
}

exports.getSong = getSong
