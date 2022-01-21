import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { docData } from 'rxfire/firestore'

export function streamSong (songId) {
  return docData(doc(getFirestore(), `songs/${songId}`), 'id')
}

export function getSong (songId) {
  return getDoc(doc(getFirestore(), `songs/${songId}`))
    .then(doc => ({ ...doc.data(), id: doc.id }))
}

export function saveSong (songId, options) {
  return setDoc(doc(getFirestore(), `songs/${songId}`), options)
}
