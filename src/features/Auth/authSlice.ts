import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '@store'
import { mapDocsId } from '@utils/api'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut as _signOut, updateProfile, User } from 'firebase/auth'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'

export enum LoginStatus {
  loggedIn = 'loggedIn',
  loggedOut = 'loggedOut',
  undetermined = 'undetermined'
}

export interface AuthState {
  user: UserType,
  status: LoginStatus,
  organisations: OrganisationType[],
  organisation: OrganisationType
}

const initialState: AuthState = {
  user: null,
  status: LoginStatus.undetermined,
  organisation: null,
  organisations: []
}

export const signIn = createAsyncThunk<
  { email: string, displayName: string },
  { email: string, password: string },
  {
    dispatch: AppDispatch
  }
>('user/signIn', async ({ email, password }, { dispatch }) => {
  const userCred = await signInWithEmailAndPassword(getAuth(), email, password)
  const { displayName } = userCred.user

  dispatch(fetchUserOrganisations(email))

  return {
    email,
    displayName
  }
})

export const createAccount = createAsyncThunk<
  { email: string, displayName: string },
  { email: string, password: string, displayName: string},
  {
    dispatch: AppDispatch
  }
>('auth/createAccount', async ({ email, password, displayName }, { dispatch }) => {
  const userCred = await createUserWithEmailAndPassword(getAuth(), email, password)
  await updateProfile(userCred.user, { displayName })

  dispatch(fetchUserOrganisations(email))

  return {
    email,
    displayName
  }
})

export const signOut = createAsyncThunk('user/signOut', () => _signOut(getAuth()))

export const initializeUser = createAsyncThunk<
  { email: string, displayName: string },
  void,
  {
    dispatch: AppDispatch
  }
>('user/init', async (_, { dispatch }) => {
  const user: User = await new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(getAuth(), user => {
      unsubscribe()
      resolve(user)
    }, reject)
  })

  if (user) {
    const { displayName, email } = user

    dispatch(fetchUserOrganisations(email))

    return {
      email,
      displayName
    }
  }

  return null
})

export const fetchUserOrganisations = createAsyncThunk<
  OrganisationType[],
  string,
  {
    state: RootState
  }
>('user/fetchOrganisations', async (email = '', { getState }) => {
  const organisations = await getDocs(query(collection(getFirestore(), 'organisations'), where('members', 'array-contains', email || getState().auth.user.email)))
    .then(docs => mapDocsId(docs))

  return organisations
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    selectOrganisation(state, action: PayloadAction<string>) {
      state.organisations.find(({ id }) => id === state.organisation.id).selected = false
      state.organisations.find(({ id }) => id === action.payload).selected = true
      state.organisation = state.organisations.find(({ id }) => id === action.payload)
    }
  },
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
      .addCase(signOut.fulfilled, (state) => {
        state.user = null
        state.status = LoginStatus.loggedOut
        state.organisation = null
        state.organisations = []
      })
      .addCase(initializeUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload
          state.status = LoginStatus.loggedIn
        } else {
          state.user = null
          state.organisation = null
          state.organisations = []
          state.status = LoginStatus.loggedOut
        }
      })
      .addCase(fetchUserOrganisations.fulfilled, (state, action) => {
        state.organisations = action.payload
        state.organisations[0].selected = true
        state.organisation = action.payload[0]
      })
  }
})

export const { selectOrganisation } = authSlice.actions

export default authSlice.reducer
