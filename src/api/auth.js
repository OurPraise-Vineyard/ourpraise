import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'

export function signIn (email, password) {
  return signInWithEmailAndPassword(getAuth(), email, password)
}

export function signOut () {
  return signOut(getAuth())
}

export function observeAuthState (cb) {
  return onAuthStateChanged(getAuth(), cb)
}
