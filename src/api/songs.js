import { collection, doc, getDoc, getFirestore, orderBy, query, setDoc } from 'firebase/firestore'
import { collectionData, docData } from 'rxfire/firestore'

export function streamSong (songId) {
  return docData(doc(getFirestore(), `songs/${songId}`), { idField: 'id' })
}

export function getSong (songId) {
  return getDoc(doc(getFirestore(), `songs/${songId}`))
    .then(doc => ({ ...doc.data(), id: doc.id }))
}

export function saveSong (songId, options) {
  return setDoc(doc(getFirestore(), `songs/${songId}`), options)
}

export function streamRecommendedSongs () {
  return collectionData(query(collection(getFirestore(), 'songs'), orderBy('createdAt', 'desc')), { idField: 'id' })
}
