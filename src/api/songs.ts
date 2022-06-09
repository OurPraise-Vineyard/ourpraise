import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import { docData } from 'rxfire/firestore'
import { Observable } from 'rxjs'

export function streamSong (songId: string): Observable<SongType> {
  return docData(doc(getFirestore(), `songs/${songId}`), { idField: 'id' }) as unknown as Observable<SongType>
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

export function deleteSong (songId) {
  return deleteDoc(doc(getFirestore(), `songs/${songId}`))
}
