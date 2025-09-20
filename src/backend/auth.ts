/**
 * Handles auth state. All auth actions are routed to lib/auth
 */
import * as Auth from '~/lib/auth'
import type { ILoginStatus, IUser } from '~/types/backend'

export interface IAuthState {
  user: IUser | null
  status: ILoginStatus
}

let authState: IAuthState | null = null

export async function getAuthState(): Promise<IAuthState> {
  if (authState !== null) {
    return authState
  }

  const user = await Auth.initializeUser()

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
  const user = await Auth.login(email, password)
  authState = {
    user,
    status: 'loggedIn'
  }

  return authState
}

export async function logout(): Promise<IAuthState> {
  await Auth.logout()
  authState = {
    user: null,
    status: 'loggedOut'
  }

  return authState
}
