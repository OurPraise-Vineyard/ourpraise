/**
 * Handles auth state. All auth actions are routed to lib/auth
 */
import type { IAuthState } from '~/types/backend'

import { initializeUser, signIn, signOut } from './firebase'

let authState: IAuthState | null = null

export async function getAuthState(): Promise<IAuthState> {
  if (authState !== null) {
    return authState
  }

  const user = await initializeUser()

  authState = {
    user,
    status: user ? 'loggedIn' : 'loggedOut'
  }

  return authState
}

export async function login(
  email: string,
  password: string
): Promise<IAuthState> {
  const user = await signIn(email, password)
  authState = {
    user,
    status: 'loggedIn'
  }

  return authState
}

export async function logout(): Promise<IAuthState> {
  await signOut()
  authState = {
    user: null,
    status: 'loggedOut'
  }

  return authState
}
