import { pruneObject } from '@api/utils'
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'

export function addEvent (options) {
  return addDoc(collection(getFirestore(), 'events'), {
    ...options,
    createdAt: new Date().toISOString()
  })
}

export function saveEvent (eventId, options) {
  return updateDoc(doc(getFirestore(), `events/${eventId}`), pruneObject({
    ...options,
    id: undefined,
    songs: options.songs.map(song => ({
      id: song.id,
      transpose: song.transpose,
      comment: song.comment
    }))
  }))
}

export async function getFullEvent (eventId) {
  const event: EventType = await getDoc(doc(getFirestore(), `events/${eventId}`))
    .then(doc => {
      const data = doc.data()
      return {
        title: data.title,
        date: data.date,
        comment: data.comment,
        createdAt: data.createdAt,
        songs: data.songs || [],
        id: doc.id
      }
    })

  const songs = await Promise.all(
    event.songs.map(
      song => getDoc(doc(getFirestore(), `songs/${song.id}`))
        .then(doc => ({
          ...doc.data(),
          ...song
        }))
    )
  )

  return {
    ...event,
    songs
  }
}

export function deleteEvents (eventId) {
  return deleteDoc(doc(getFirestore(), `events/${eventId}`))
}
