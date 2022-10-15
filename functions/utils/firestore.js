export const getEvent = async (database, id) => {
  const doc = await database.doc(`events/${id}`).get()

  if (!doc.exists) return null

  return {
    id,
    title: doc.data().title,
    songs: doc.data().songs.map(async songId => {
      return await getSong(database, songId)
    })
  }
}

export const getSong = async (database, id) => {
  const doc = await database.doc(`songs/${id}`).get()

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
