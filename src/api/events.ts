import { mapDocsId, pruneObject } from '@api/utils'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, runTransaction, updateDoc } from 'firebase/firestore'

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

interface EventType {
  songs: Array<Record<string, unknown>>,
  id: string,
  title: string,
  comment: string,
  createdAt: string,
  date: string
}

export async function getEvent (eventId) {
  const event: EventType = await getDoc(doc(getFirestore(), `events/${eventId}`))
    .then(doc => {
      const data = doc.data()
      return {
        title: data.title,
        date: data.date,
        comment: data.comment,
        createdAt: data.createdAt,
        songs: data.songs,
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

export function addSongToEvent (eventId: string, songId: string) {
  const eventRef = doc(getFirestore(), `events/${eventId}`)
  return runTransaction(getFirestore(), async transaction => {
    const eventDoc = await transaction.get(eventRef)

    if (!eventDoc.exists) {
      throw new Error('Event does not exist!')
    }

    const songs = eventDoc.data().songs.concat([
      {
        id: songId,
        transpose: 0,
        comment: ''
      }
    ])

    transaction.update(eventRef, { songs })
  })
}
