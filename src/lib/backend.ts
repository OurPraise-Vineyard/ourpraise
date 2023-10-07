// Import the functions you need from the SDKs you need
import algoliasearch from 'algoliasearch/lite'
import { initializeApp } from 'firebase/app'
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

const algoliaClient = algoliasearch(
  'BF560MHA8D',
  '1d21dece723f3c5b40a8ae2faad53c0f'
)
const algoliaIndex = algoliaClient.initIndex('dev_ourpraise')

// Initialize Firebase
initializeApp(firebaseConfig)

if (window.location.hostname === 'localhost') {
  connectFirestoreEmulator(getFirestore(), 'localhost', 8080)
}

function getUserMetadata(email: string): Promise<IUserMetadata> {
  return getDoc(doc(getFirestore(), `users/${email}`)).then(
    doc => doc.data() as IUserMetadata
  )
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

export class BackendError extends Error {
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
  },

  async signIn(email: string, password: string): Promise<IUser> {
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
  },

  signOut() {
    return _signOut(getAuth())
  },

  async initializeUser(): Promise<IUser | null> {
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
  },

  async getCollection({
    path: collectionPath,
    orderBy: orderByField,
    sortDirection
  }: ICollectionQuery): Promise<ICollection> {
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
  },

  async getDoc(path: string): Promise<IDoc> {
    const result = await getDoc(doc(getFirestore(), path))

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
      throw new BackendError(`Failed saving document "${path}"`)
    }
  },

  createDoc(path, value: unknown) {
    try {
      return addDoc(collection(getFirestore(), path), value)
    } catch (err) {
      throw new BackendError(`Failed creating document in "${path}"`)
    }
  },

  deleteDoc(path) {
    try {
      return deleteDoc(doc(getFirestore(), path))
    } catch (err) {
      throw new BackendError(`Failed deleting document "${path}"`)
    }
  },

  async searchSongs(query: string): Promise<ISearchHit[]> {
    try {
      return algoliaIndex.search(query).then(({ hits }) => hits)
    } catch (err) {
      throw new BackendError(`Failed searching songs for "${query}"`)
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
          throw new Error()
        }
        const oldData = mapDocId(docData)
        const newData = updater(oldData) as Partial<unknown>

        if (options) {
          transaction.set(docRef, newData, options)
        } else {
          transaction.set(docRef, newData)
        }
      })
    } catch (err) {
      throw new BackendError(err)
    }
  }
}

export default Backend
