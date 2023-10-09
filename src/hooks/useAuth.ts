import { useCallback, useEffect, useMemo } from 'react'

import { useAppDispatch, useAppSelector } from '@hooks/state'
import useErrors from '@hooks/useErrors'
import {
  createAccount,
  initializeUser,
  signIn,
  signOut
} from '@state/authSlice'

type IAuthHook = {
  user: IUser | null
  ready: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  createUser: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>
}

export default function useAuth(): IAuthHook {
  const user = useAppSelector(state => state.auth.user)
  const ready = useAppSelector(state => state.auth.status !== 'undetermined')
  const dispatch = useAppDispatch()
  const { pushError } = useErrors()

  useEffect(
    function () {
      if (ready) {
        return
      }

      try {
        dispatch(initializeUser()).unwrap()
      } catch (err) {
        pushError(err)
      }
    },
    [dispatch, ready, pushError]
  )

  const _signIn = useCallback(
    async (email: string, password: string) => {
      try {
        await dispatch(signIn({ email, password })).unwrap()
      } catch (err) {
        pushError(err)
        throw err
      }
    },
    [dispatch, pushError]
  )

  const _signOut = useCallback(async () => {
    try {
      await dispatch(signOut()).unwrap()
    } catch (err) {
      pushError(err)
      throw err
    }
  }, [dispatch, pushError])

  const _createUser = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        await dispatch(createAccount({ email, password, displayName })).unwrap()
      } catch (err) {
        pushError(err)
        throw err
      }
    },
    [dispatch, pushError]
  )

  return useMemo(
    (): IAuthHook => ({
      user,
      ready,
      signIn: _signIn,
      signOut: _signOut,
      createUser: _createUser
    }),
    [user, ready, _signIn, _createUser, _signOut]
  )
}
