import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as _signOut,
  updateProfile,
  User
} from 'firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

function getUserMetadata(email: string): Promise<IUserMetadata> {
  return getDoc(doc(getFirestore(), `users/${email}`)).then(doc => doc.data() as IUserMetadata)
}

export const signIn = createAsyncThunk<IUser, { email: string; password: string }>(
  'auth/signIn',
  async ({ email, password }) => {
    const userCred = await signInWithEmailAndPassword(getAuth(), email, password)
    const { displayName } = userCred.user

    const meta = await getUserMetadata(email)

    return {
      email,
      displayName,
      ...meta
    }
  }
)

export const createAccount = createAsyncThunk<
  IUser,
  { email: string; password: string; displayName: string }
>('auth/createAccount', async ({ email, password, displayName }) => {
  if (!displayName) {
    throw new Error('Please provide a name for this account.')
  }

  const userCred = await createUserWithEmailAndPassword(getAuth(), email, password)
  await updateProfile(userCred.user, { displayName })

  const meta = await getUserMetadata(email)

  return {
    email,
    displayName,
    ...meta
  }
})

export const signOut = createAsyncThunk('auth/signOut', () => _signOut(getAuth()))

export const initializeUser = createAsyncThunk<IUser>('auth/init', async () => {
  const user: User = await new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      user => {
        unsubscribe()
        resolve(user)
      },
      reject
    )
  })

  if (user) {
    const { displayName, email } = user

    const meta = await getUserMetadata(email)

    return {
      email,
      displayName,
      ...meta
    }
  }

  return null
})
