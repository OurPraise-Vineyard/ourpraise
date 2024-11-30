import { ParsedLocation, redirect } from '@tanstack/react-router'

import * as Auth from '~/lib/auth'

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

export async function requireLoggedIn({
  location
}: {
  location: ParsedLocation
}): Promise<void> {
  if (authState.status !== 'loggedIn') {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href
      }
    })
  }
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
    console.error(err)

    return authState
  }
}

export async function login(
  email: string,
  password: string
): Promise<IAuthState> {
  try {
    const user = await Auth.login(email, password)
    authState = {
      user,
      status: 'loggedIn'
    }

    return authState
  } catch (err) {
    console.error(err)

    return authState
  }
}

export async function logout(): Promise<IAuthState> {
  try {
    await Auth.logout()
    authState = {
      user: null,
      status: 'loggedOut'
    }

    return authState
  } catch (err) {
    console.error(err)

    return authState
  }
}
