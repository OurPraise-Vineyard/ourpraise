import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut as _signOut } from 'firebase/auth'

export function signIn (email, password) {
  return signInWithEmailAndPassword(getAuth(), email, password)
}

export function signOut () {
  return _signOut(getAuth())
}

export function observeAuthState (cb) {
  return onAuthStateChanged(getAuth(), cb)
}
