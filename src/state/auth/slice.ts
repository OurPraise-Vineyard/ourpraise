import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  addOrganisationMember,
  changeMemberRole,
  createAccount,
  initializeUser,
  removeOrganisationMember,
  signIn,
  signOut
} from '@state/auth/api'

export enum LoginStatus {
  loggedIn = 'loggedIn',
  loggedOut = 'loggedOut',
  undetermined = 'undetermined'
}

export interface AuthState {
  user: UserType
  status: LoginStatus
  organisations: OrganisationType[]
  organisation: OrganisationType
}

const initialState: AuthState = {
  user: null,
  status: LoginStatus.undetermined,
  organisation: null,
  organisations: []
}

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
      .addCase(signOut.fulfilled, state => {
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
