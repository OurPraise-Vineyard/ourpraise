import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
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

async function fetchUserOrganisations (email) {
  const organisations = await getDocs(query(collection(getFirestore(), 'organisations'), where('members', 'array-contains', email)))
  .then(docs => mapDocsId(docs))

  return organisations
}

export const signIn = createAsyncThunk<
  { email: string, displayName: string, organisations: OrganisationType[] },
  { email: string, password: string }
>('user/signIn', async ({ email, password }) => {
  const userCred = await signInWithEmailAndPassword(getAuth(), email, password)
  const { displayName } = userCred.user

  const organisations = await fetchUserOrganisations(email)

  return {
    email,
    displayName,
    organisations
  }
})

export const createAccount = createAsyncThunk<
  { email: string, displayName: string, organisations: OrganisationType[] },
  { email: string, password: string, displayName: string}
>('auth/createAccount', async ({ email, password, displayName }) => {
  const userCred = await createUserWithEmailAndPassword(getAuth(), email, password)
  await updateProfile(userCred.user, { displayName })

  const organisations = await fetchUserOrganisations(email)

  return {
    email,
    displayName,
    organisations
  }
})

export const signOut = createAsyncThunk('user/signOut', () => _signOut(getAuth()))

export const initializeUser = createAsyncThunk<
  { email: string, displayName: string, organisations: OrganisationType[] }
>('user/init', async () => {
  const user: User = await new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(getAuth(), user => {
      unsubscribe()
      resolve(user)
    }, reject)
  })

  if (user) {
    const { displayName, email } = user

    const organisations = await fetchUserOrganisations(email)

    return {
      email,
      displayName,
      organisations
    }
  }

  return null
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
        if (action.payload.organisations.length > 0) {
          state.organisations = action.payload.organisations
          state.organisations[0].selected = true
          state.organisation = action.payload.organisations[0]
        } else {
          state.organisation = null
          state.organisations = []
        }
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = LoginStatus.loggedIn
        if (action.payload.organisations.length > 0) {
          state.organisations = action.payload.organisations
          state.organisations[0].selected = true
          state.organisation = action.payload.organisations[0]
        } else {
          state.organisation = null
          state.organisations = []
        }
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
          if (action.payload.organisations.length > 0) {
            state.organisations = action.payload.organisations
            state.organisations[0].selected = true
            state.organisation = action.payload.organisations[0]
          } else {
            state.organisation = null
            state.organisations = []
          }
        } else {
          state.user = null
          state.organisation = null
          state.organisations = []
          state.status = LoginStatus.loggedOut
        }
      })
  }
})

export const { selectOrganisation } = authSlice.actions

export default authSlice.reducer
