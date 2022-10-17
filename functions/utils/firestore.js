const { getFirestore } = require('firebase-admin/firestore')

const db = getFirestore()

export const getEvent = async id => {
  const doc = await db.doc(`events/${id}`).get()

  if (!doc.exists) return null

  return {
    id,
    title: doc.data().title,
    songs: doc.data().songs.map(async songId => {
      return await getSong(songId)
    })
  }
}

export const getSong = async id => {
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
