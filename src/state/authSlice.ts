import Backend from '@lib/backend'
import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch } from '@state/store'

export const signIn = createAsyncThunk<
  IUser,
  { email: string; password: string },
  { dispatch: AppDispatch }
>('auth/signIn', async ({ email, password }, { dispatch }) => {
  try {
    return await Backend.signIn(email, password)
  } catch (err) {
    const backendErr = err as IBackendError
    if (
      backendErr.name === 'BackendError' &&
      backendErr.message.toString().includes('not authorized')
    ) {
      await dispatch(signOut()).unwrap()
    }
    throw err
  }
})

export const createAccount = createAsyncThunk<
  IUser,
  IRegisterForm,
  { dispatch: AppDispatch }
>(
  'auth/createAccount',
  async ({ email, password, displayName }, { dispatch }) => {
    try {
      return await Backend.createUser({ email, password, displayName })
    } catch (err) {
      const backendErr = err as IBackendError
      if (
        backendErr.name === 'BackendError' &&
        backendErr.message.toString().includes('not authorized')
      ) {
        await dispatch(signOut()).unwrap()
      }
      throw err
    }
  }
)

export const signOut = createAsyncThunk('auth/signOut', () => Backend.signOut())

export const initializeUser = createAsyncThunk<
  IUser | null,
  void,
  { dispatch: AppDispatch }
>('auth/init', async (_, { dispatch }) => {
  try {
    return await Backend.initializeUser()
  } catch (err) {
    const backendErr = err as IBackendError
    if (
      backendErr.name === 'BackendError' &&
      backendErr.message.toString().includes('not authorized')
    ) {
      await dispatch(signOut()).unwrap()
    }
    throw err
  }
})

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
