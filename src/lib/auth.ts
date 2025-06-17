import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import type { User } from 'firebase/auth'
import type { IUser } from '~/types/backend'

import { BackendError } from './firebase'

export async function login(email: string, password: string): Promise<IUser> {
  try {
    const userCred = await signInWithEmailAndPassword(
      getAuth(),
      email,
      password
    )
    const { displayName } = userCred.user

    return {
      email,
      displayName: displayName || email.split('@')[0]
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
