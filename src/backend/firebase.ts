import { FirebaseError, initializeApp } from 'firebase/app'
import {
  type User,
  connectAuthEmulator,
  signInWithEmailAndPassword as firebaseSignIn,
  signOut as firebaseSignOut,
  getAuth,
  onAuthStateChanged
} from 'firebase/auth'
import {
  type DocumentData,
  QueryConstraint,
  QuerySnapshot,
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where
} from 'firebase/firestore'

import { type IBackendError, type ICollectionQuery, type IUser } from '~/types'

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
  connectAuthEmulator(getAuth(), 'http://localhost:9099', {
    disableWarnings: true
  })
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

// Authentication

export async function signIn(email: string, password: string): Promise<IUser> {
  try {
    const userCred = await firebaseSignIn(getAuth(), email, password)
    const { displayName } = userCred.user

    return {
      email,
      displayName: displayName || email.split('@')[0]
    }
  } catch (err) {
    throw new BackendError(err as Error)
  }
}

export async function signOut() {
  try {
    return firebaseSignOut(getAuth())
  } catch (err) {
    throw new BackendError(err as Error)
  }
}

export async function initializeUser(): Promise<IUser | null> {
  try {
    const user: User | null = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        getAuth(),
        user => {
          unsubscribe()
          resolve(user)
        },
        reject
      )
    })

    if (user && user.email) {
      const { displayName, email } = user

      return {
        email,
        displayName: displayName || email.split('@')[0]
      }
    }

    return null
  } catch (err) {
    throw new BackendError(err as Error)
  }
}

// Database

export async function getCollection<T>({
  path: collectionPath,
  where: whereFields,
  orderBy: orderByField,
  sortDirection = 'asc'
}: ICollectionQuery): Promise<T[]> {
  try {
    const filters: QueryConstraint[] = []

    if (whereFields?.length) {
      for (const whereField of whereFields) {
        filters.push(where(...whereField))
      }
    }

    if (orderByField) {
      filters.push(orderBy(orderByField, sortDirection))
    }

    return getDocs(
      query(collection(getFirestore(), collectionPath), ...filters)
    ).then(
      (snap: QuerySnapshot<DocumentData>) =>
        snap.docs.map(doc => ({ ...doc.data(), id: doc.id })) as T[]
    )
  } catch (err) {
    throw new BackendError(err as Error)
  }
}

export async function getDocument<T>(path: string): Promise<T> {
  let result
  try {
    result = await getDoc(doc(getFirestore(), path))
  } catch (err) {
    throw new BackendError(err as Error)
  }

  if (result.exists()) {
    return {
      ...result.data(),
      id: result.id
    } as T
  }

  throw new BackendError(new Error(`Document "${path}" does not exist.`))
}

export async function createDocument<T>(path: string, value: Omit<T, 'id'>) {
  try {
    return addDoc(collection(getFirestore(), path), value)
  } catch (err) {
    throw new BackendError(err as Error)
  }
}

export async function updateDocument<T>(
  path: string,
  value: Omit<T, 'id'>
): Promise<void> {
  try {
    return setDoc(doc(getFirestore(), path), value, { merge: true })
  } catch (err) {
    throw new BackendError(err as Error)
  }
}

export async function deleteDocument(path: string) {
  try {
    return deleteDoc(doc(getFirestore(), path))
  } catch (err) {
    throw new BackendError(err as Error)
  }
}
