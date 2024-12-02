import {
  User,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

import { IUser, IUserMetadata } from '~/types/backend'

import { BackendError } from './firebase'

function getUserMetadata(email: string): Promise<IUserMetadata> {
  return getDoc(doc(getFirestore(), `users/${email}`)).then(doc => {
    if (doc.exists() && doc.data().role) {
      return doc.data() as IUserMetadata
    }
    throw new BackendError(new Error(`Email ${email} not authorized`))
  })
}

export async function login(email: string, password: string): Promise<IUser> {
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
    throw new BackendError(err as Error)
  }
}

export async function logout() {
  try {
    return signOut(getAuth())
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

      const meta = await getUserMetadata(email)

      return {
        email,
        displayName: displayName || email,
        ...meta
      }
    }

    return null
  } catch (err) {
    throw new BackendError(err as Error)
  }
}
