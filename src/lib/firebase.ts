import { FirebaseError, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

import { IBackendError } from '~/types/backend'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCBfNSkzwlXjavTRNq-TmVo7QpcHrZYvgE',
  authDomain: 'ourpraise-fb.firebaseapp.com',
  projectId: 'ourpraise-fb',
  storageBucket: 'ourpraise-fb.appspot.com',
  messagingSenderId: '485823144275',
  appId: '1:485823144275:web:a6eae91b382d7ebefc41a6'
}

// Initialize Firebase
initializeApp(firebaseConfig)

if (window.location.hostname === 'localhost') {
  connectFirestoreEmulator(getFirestore(), 'localhost', 8080)
  connectAuthEmulator(getAuth(), 'http://localhost:9099')
}

const firebaseErrors = {
  'auth/invalid-email': 'Please provide a valid email.',
  'auth/email-already-in-use': 'Email already in use.',
  'auth/weak-password': 'Password should be at least six characters long.',
  'auth/wrong-password': 'Wrong password.',
  'auth/user-not-found': 'User does not exist.',
  'permission-denied': 'You do not have permission to perform this action.'
}

type firebaseErrorKey = keyof typeof firebaseErrors

function mapFirebaseError(err: Error): string {
  if (err.name === 'BackendError') {
    return err.message
  }

  const code = (err as FirebaseError).code as firebaseErrorKey

  if (firebaseErrors[code]) {
    return 'Error: ' + firebaseErrors[code]
  }

  return 'Error: ' + (err.message || 'An error occurred.')
}

export class BackendError extends Error implements IBackendError {
  constructor(err: Error) {
    super(mapFirebaseError(err))
    this.name = 'BackendError'
  }
}
