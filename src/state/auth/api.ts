import { createAsyncThunk } from '@reduxjs/toolkit'
import { mapDocId } from '@utils/api'
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as _signOut,
  updateProfile,
  User
} from 'firebase/auth'
import {
  deleteField,
  doc,
  FieldPath,
  getDoc,
  getFirestore,
  runTransaction,
  updateDoc
} from 'firebase/firestore'

async function fetchUserOrganisations(email) {
  const userOrgs = await getDoc(doc(getFirestore(), `users/${email}`)).then(doc =>
    doc.exists ? doc.data().organisations : []
  )

  const organisations = Promise.all(
    userOrgs.map(org => getDoc(doc(getFirestore(), `organisations/${org}`)).then(mapDocId))
  )

  return organisations
}

export const signIn = createAsyncThunk<
  { email: string; displayName: string; organisations: OrganisationType[] },
  { email: string; password: string }
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
  { email: string; displayName: string; organisations: OrganisationType[] },
  { email: string; password: string; displayName: string }
>('auth/createAccount', async ({ email, password, displayName }) => {
  if (!displayName) {
    throw new Error('Please provide a name for this account.')
  }

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

export const initializeUser = createAsyncThunk<{
  email: string
  displayName: string
  organisations: OrganisationType[]
}>('auth/init', async () => {
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
  { member: string; organisationId: string; role: 'user' | 'admin' },
  { member: string; organisationId: string; role: 'user' | 'admin' }
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
  { member: string; organisationId: string },
  { member: string; organisationId: string }
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
  }).then(() => ({
    member,
    organisationId
  }))
})

export const addOrganisationMember = createAsyncThunk<
  { member: string; organisationId: string },
  { email: string; organisationId: string }
>('auth/addMember', ({ organisationId, email }) => {
  const orgDocRef = doc(getFirestore(), `organisations/${organisationId}`)
  return runTransaction(getFirestore(), async transaction => {
    const org = await transaction.get(orgDocRef)

    if (org.exists) {
      const members = org.data().members

      transaction.update(
        orgDocRef,
        new FieldPath('roles', email),
        'admin',
        'members',
        members.concat([email])
      )
    }
  }).then(() => ({
    member: email,
    organisationId
  }))
})
