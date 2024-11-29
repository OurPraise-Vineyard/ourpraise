import { FirebaseError, initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

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
}

const firebaseErrors = {
  'auth/invalid-email': 'Please provide a valid email.',
  'auth/email-already-in-use': 'Email already in use.',
  'auth/weak-password': 'Password should be at least six characters long.',
  'auth/wrong-password': 'Wrong password.',
  'auth/user-not-found': 'User does not exist',
  'permission-denied': 'You do not have permission to perform this action'
}

function mapFirebaseError(err: unknown, fallback: string) {
  if ((err as BackendError).name === 'BackendError') {
    return (err as BackendError).message
  }

  const code = (err as FirebaseError).code

  if (firebaseErrors[code]) {
    return firebaseErrors[code]
  }

  console.log('Could not map error: ' + code)
  console.log(err)
  return fallback
}

export class BackendError extends Error implements IBackendError {
  constructor(message: string) {
    super(mapFirebaseError(message, 'An error occurred'))
    this.name = 'BackendError'
  }
}
