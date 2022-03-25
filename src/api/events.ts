import { mapDocsId, pruneObject } from '@api/utils'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc } from 'firebase/firestore'

export function getRecentEvents () {
  return getDocs(query(collection(getFirestore(), 'events'), orderBy('date', 'desc')))
    .then(docs => mapDocsId(docs))
}

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

export async function getEvent (eventId) {
  const event:any = await getDoc(doc(getFirestore(), `events/${eventId}`))
    .then(doc => ({
      ...doc.data(),
      id: doc.id
    }))

  const songs = await Promise.all(
    event.songs.map(
      song => getDoc(doc(getFirestore(), `songs/${song.id}`))
        .then(doc => ({
          ...doc.data,
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
