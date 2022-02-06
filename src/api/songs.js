import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc } from 'firebase/firestore'
import { docData } from 'rxfire/firestore'

function mapDocsRes (snap) {
  return snap.docs.map(doc => ({ ...doc.data(), id: doc.id }))
}

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
  return getDocs(query(collection(getFirestore(), 'songs'), orderBy('createdAt', 'desc')), { idField: 'id' })
    .then(mapDocsRes)
}

export function getAllSongs () {
  return getDocs(query(collection(getFirestore(), 'songs'), orderBy('title', 'asc')), { idField: 'id' })
    .then(mapDocsRes)
}

export function deleteSong (songId) {
  return deleteDoc(doc(getFirestore(), `songs/${songId}`))
}
