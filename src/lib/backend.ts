// Import the functions you need from the SDKs you need
import { FirebaseError, initializeApp } from 'firebase/app'
import {
  User,
  signOut as _signOut,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import {
  DocumentData,
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
  runTransaction,
  setDoc
} from 'firebase/firestore'

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

function getUserMetadata(email: string): Promise<IUserMetadata> {
  return getDoc(doc(getFirestore(), `users/${email}`)).then(doc => {
    if (doc.exists() && doc.data().role) {
      return doc.data() as IUserMetadata
    }
    throw new BackendError(`Email ${email} not authorized`)
  })
}

function mapDocId(doc: DocumentData): IDoc {
  return {
    ...doc.data(),
    id: doc.id
  }
}

function mapDocsId(snap: QuerySnapshot<DocumentData>): ICollection {
  return snap.docs.map(doc => ({ ...doc.data(), id: doc.id }))
}

export class BackendError extends Error implements IBackendError {
  constructor(message) {
    super(message)
    this.name = 'BackendError'
  }
}

const Backend = {
  async createUser({
    email,
    password,
    displayName
  }: IRegisterForm): Promise<IUser> {
    if (!displayName) {
      throw new BackendError('Please provide a name for this account.')
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password
      )
      await updateProfile(userCred.user, { displayName })
      const meta = await getUserMetadata(email)

      return {
        email,
        displayName,
        role: meta.role
      }
    } catch (err) {
      throw new BackendError(mapFirebaseError(err, 'Failed creating user'))
    }
  },

  async signIn(email: string, password: string): Promise<IUser> {
    try {
      const userCred = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password
      )
      const { displayName } = userCred.user

      const meta = await getUserMetadata(email)

      return {
        email,
        displayName: displayName || email,
        ...meta
      }
    } catch (err) {
      throw new BackendError(mapFirebaseError(err, 'Failed signing in user'))
    }
  },

  signOut() {
    try {
      return _signOut(getAuth())
    } catch (err) {
      throw new BackendError(mapFirebaseError(err, 'Failed signing out user'))
    }
  },

  async initializeUser(): Promise<IUser | null> {
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

        const meta = await getUserMetadata(email)

        return {
          email,
          displayName: displayName || email,
          ...meta
        }
      }

      return null
    } catch (err) {
      throw new BackendError(mapFirebaseError(err, 'Failed initializing user'))
    }
  },

  async getCollection({
    path: collectionPath,
    orderBy: orderByField,
    sortDirection
  }: ICollectionQuery): Promise<ICollection> {
    try {
      if (orderByField && sortDirection) {
        return getDocs(
          query(
            collection(getFirestore(), collectionPath),
            orderBy(orderByField, sortDirection)
          )
        ).then(docs => mapDocsId(docs))
      }
      return getDocs(query(collection(getFirestore(), collectionPath))).then(
        docs => mapDocsId(docs)
      )
    } catch (err) {
      throw new BackendError(
        mapFirebaseError(err, `Failed getting collection ${collectionPath}`)
      )
    }
  },

  async getDoc(path: string): Promise<IDoc> {
    let result
    try {
      result = await getDoc(doc(getFirestore(), path))
    } catch (err) {
      throw new BackendError(
        mapFirebaseError(err, `Failed getting document "${path}"`)
      )
    }

    if (result.exists()) {
      return mapDocId(result)
    }

    throw new BackendError(`Document "${path}" does not exist.`)
  },

  setDoc(
    path: string,
    value: IDoc,
    options?: { merge?: boolean }
  ): Promise<void> {
    try {
      if (options) {
        return setDoc(doc(getFirestore(), path), value, options)
      }
      return setDoc(doc(getFirestore(), path), value)
    } catch (err) {
      throw new BackendError(
        mapFirebaseError(err, `Failed saving document "${path}"`)
      )
    }
  },

  createDoc(path, value: unknown) {
    try {
      return addDoc(collection(getFirestore(), path), value)
    } catch (err) {
      throw new BackendError(
        mapFirebaseError(err, `Failed creating document in "${path}"`)
      )
    }
  },

  deleteDoc(path) {
    try {
      return deleteDoc(doc(getFirestore(), path))
    } catch (err) {
      throw new BackendError(
        mapFirebaseError(err, `Failed deleting document "${path}"`)
      )
    }
  },

  async getAndSetDoc(
    path: string,
    updater: (data: IDoc) => unknown,
    options?: { merge?: boolean }
  ): Promise<void> {
    try {
      await runTransaction(getFirestore(), async transaction => {
        const docRef = doc(getFirestore(), path)
        const docData = await transaction.get(docRef)
        if (!docData.exists()) {
          throw new BackendError(`Document "${path}" not found`)
        }
        const oldData = mapDocId(docData)
        const newData = updater(oldData) as Partial<unknown>

        if (newData) {
          if (options) {
            transaction.set(docRef, newData, options)
          } else {
            transaction.set(docRef, newData)
          }
        }
      })
    } catch (err) {
      throw new BackendError(
        mapFirebaseError(err, `Failing updating document "${path}"`)
      )
    }
  }
}

export default Backend
