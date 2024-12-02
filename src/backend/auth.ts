import * as Auth from '~/lib/auth'
import { ILoginStatus, IUser } from '~/types/backend'

export interface IAuthState {
  user: IUser | null
  status: ILoginStatus
}

let authState: IAuthState = {
  user: null,
  status: 'undetermined'
}

export function getAuthState(): IAuthState {
  return authState
}

export async function initializeUser(): Promise<IAuthState> {
  try {
    const user = await Auth.initializeUser()

    authState = {
      user,
      status: user ? 'loggedIn' : 'loggedOut'
    }

    return authState
  } catch (err) {
    return authState
  }
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
