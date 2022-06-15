import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut as _signOut, User } from 'firebase/auth'

export enum LoginStatus {
  loggedIn = 'loggedIn',
  loggedOut = 'loggedOut',
  undetermined = 'undetermined'
}

export interface AuthState {
  user: UserType,
  status: LoginStatus
}

const initialState: AuthState = {
  user: null,
  status: LoginStatus.undetermined
}

export const signIn = createAsyncThunk<
  { email: string, displayName: string },
  { email: string, password: string }
>('user/signIn', async ({ email, password }) => {
  const userCred = await signInWithEmailAndPassword(getAuth(), email, password)
  const { displayName } = userCred.user

  return {
    email,
    displayName
  }
})

export const signOut = createAsyncThunk('user/signOut', () => _signOut(getAuth()))

export const initializeUser = createAsyncThunk<
  { email: string, displayName: string }
>('user/init', async () => {
  const user: User = await new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(getAuth(), user => {
      unsubscribe()
      resolve(user)
    }, reject)
  })

  if (user) {
    const { displayName, email } = user

    return {
      email,
      displayName
    }
  }

  return null
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = LoginStatus.loggedIn
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null
        state.status = LoginStatus.loggedOut
      })
      .addCase(initializeUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload
          state.status = LoginStatus.loggedIn
        } else {
          state.user = null
          state.status = LoginStatus.loggedOut
        }
      })
  }
})

export default authSlice.reducer
