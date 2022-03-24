import { mapDocsId } from 'api/utils'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc } from 'firebase/firestore'
import { docData } from 'rxfire/firestore'

export function streamSong (songId) {
  return docData(doc(getFirestore(), `songs/${songId}`), { idField: 'id' })
}

export function getSong (songId) {
  return getDoc(doc(getFirestore(), `songs/${songId}`))
    .then(doc => doc.exists ? ({ ...doc.data(), id: doc.id }) : null)
}

export function saveSong (songId, options) {
  return updateDoc(doc(getFirestore(), `songs/${songId}`), options)
}

export function addSong (options) {
  return addDoc(collection(getFirestore(), 'songs'), {
    ...options,
    createdAt: new Date().toISOString()
  })
}

export function getRecommendedSongs () {
  return getDocs(query(collection(getFirestore(), 'songs'), orderBy('createdAt', 'desc')))
    .then(docs => mapDocsId(docs))
  }

  export function getAllSongs () {
    return getDocs(query(collection(getFirestore(), 'songs'), orderBy('title', 'asc')))
    .then(docs => mapDocsId(docs))
}

export function deleteSong (songId) {
  return deleteDoc(doc(getFirestore(), `songs/${songId}`))
}
