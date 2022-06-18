import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { mapDocsId } from '@utils/api'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut as _signOut, updateProfile, User } from 'firebase/auth'
import { collection, deleteField, doc, FieldPath, getDocs, getFirestore, query, runTransaction, updateDoc, where } from 'firebase/firestore'

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
>('auth/signIn', async ({ email, password }) => {
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

export const signOut = createAsyncThunk('auth/signOut', () => _signOut(getAuth()))

export const initializeUser = createAsyncThunk<
  { email: string, displayName: string, organisations: OrganisationType[] }
>('auth/init', async () => {
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

export const changeMemberRole = createAsyncThunk<
  { member: string, organisationId: string, role: 'user' | 'admin' },
  { member: string, organisationId: string, role: 'user' | 'admin' }
>('auth/changeMemberRole', ({ member, organisationId, role }) => {
  return updateDoc(
    doc(getFirestore(), `organisations/${organisationId}`),
    new FieldPath('roles', member),
    role
  ).then(() => ({
    member,
    organisationId,
    role
  }))
})

export const removeOrganisationMember = createAsyncThunk<
  { member: string, organisationId: string },
  { member: string, organisationId: string }
>('auth/removeMember', ({ organisationId, member }) => {
  const orgDocRef = doc(getFirestore(), `organisations/${organisationId}`)
  return runTransaction(getFirestore(), async transaction => {
    const org = await transaction.get(orgDocRef)

    if (org.exists) {
      const members = org.data().members

      transaction.update(
        orgDocRef,
        new FieldPath('roles', member),
        deleteField(),
        'members',
        members.filter(id => id !== member)
      )
    }
  })
    .then(() => ({
      member,
      organisationId
    }))
})

export const addOrganisationMember = createAsyncThunk<
  { member: string, organisationId: string },
  { email: string, organisationId: string }
>('auth/addMember', ({ organisationId, email }) => {
  const orgDocRef = doc(getFirestore(), `organisations/${organisationId}`)
  return runTransaction(getFirestore(), async transaction => {
    const org = await transaction.get(orgDocRef)

    if (org.exists) {
      const members = org.data().members

      transaction.update(
        orgDocRef,
        new FieldPath('roles', email),
        'user',
        'members',
        members.concat([email])
      )
    }
  })
    .then(() => ({
      member: email,
      organisationId
    }))
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
      .addCase(changeMemberRole.fulfilled, (state, action) => {
        const { member, organisationId, role } = action.payload
        state.organisations.find(({ id }) => id === organisationId).roles[member] = role

        if (state.organisation.id === organisationId) {
          state.organisation.roles[member] = role
        }
      })
      .addCase(removeOrganisationMember.fulfilled, (state, action) => {
        const { member, organisationId } = action.payload

        const org = state.organisations.find(({ id }) => id === organisationId)
        org.members = org.members.filter(id => id !== member)
        delete org.roles[member]

        if (state.organisation.id === organisationId) {
          state.organisation = org
        }
      })
      .addCase(addOrganisationMember.fulfilled, (state, action) => {
        const { member, organisationId } = action.payload

        const org = state.organisations.find(({ id }) => id === organisationId)
        org.members = org.members.concat([member])
        org.roles[member] = 'user'

        if (state.organisation.id === organisationId) {
          state.organisation = org
        }
      })
  }
})

export const { selectOrganisation } = authSlice.actions

export default authSlice.reducer
