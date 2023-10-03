import { createSlice } from '@reduxjs/toolkit'
import { createAccount, initializeUser, signIn, signOut } from '@state/auth/api'

export enum LoginStatus {
  loggedIn = 'loggedIn',
  loggedOut = 'loggedOut',
  undetermined = 'undetermined'
}

export interface AuthState {
  user: IUser
  status: LoginStatus
}

const initialState: AuthState = {
  user: null,
  status: LoginStatus.undetermined
}

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
      .addCase(createAccount.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = LoginStatus.loggedIn
      })
      .addCase(signOut.fulfilled, state => {
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
