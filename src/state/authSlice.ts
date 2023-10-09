import Backend from '@lib/backend'
import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const signIn = createAsyncThunk<
  IUser,
  { email: string; password: string }
>('auth/signIn', async ({ email, password }) => {
  return Backend.signIn(email, password)
})

export const createAccount = createAsyncThunk<IUser, IRegisterForm>(
  'auth/createAccount',
  async ({ email, password, displayName }) => {
    if (!displayName) {
      throw new Error('Please provide a name for this account.')
    }

    return Backend.createUser({ email, password, displayName })
  }
)

export const signOut = createAsyncThunk('auth/signOut', () => Backend.signOut())

export const initializeUser = createAsyncThunk<IUser | null>(
  'auth/init',
  () => {
    return Backend.initializeUser()
  }
)

export interface IAuthState {
  user: IUser | null
  status: ILoginStatus
}

const initialState: IAuthState = {
  user: null,
  status: 'undetermined'
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = 'loggedIn'
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = 'loggedIn'
      })
      .addCase(signOut.fulfilled, state => {
        state.user = null
        state.status = 'loggedOut'
      })
      .addCase(initializeUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload
          state.status = 'loggedIn'
        } else {
          state.user = null
          state.status = 'loggedOut'
        }
      })
  }
})

export default authSlice.reducer
