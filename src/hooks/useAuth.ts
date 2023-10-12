import { useAppDispatch, useAppSelector } from 'hooks/state'
import useErrors from 'hooks/useErrors'
import { useCallback, useEffect, useMemo } from 'react'
import { createAccount, initializeUser, signIn, signOut } from 'state/authSlice'

type IAuthHook = {
  user: IUser | null
  ready: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<boolean>
  createUser: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<boolean>
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

      dispatch(initializeUser())
        .unwrap()
        .catch(err => pushError(err))
    },
    [dispatch, ready, pushError]
  )

  const _signIn = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        await dispatch(signIn({ email, password })).unwrap()
      } catch (err) {
        pushError(err)
        return false
      }
      return true
    },
    [dispatch, pushError]
  )

  const _signOut = useCallback(async (): Promise<boolean> => {
    try {
      await dispatch(signOut()).unwrap()
    } catch (err) {
      pushError(err)
      return false
    }
    return true
  }, [dispatch, pushError])

  const _createUser = useCallback(
    async (
      email: string,
      password: string,
      displayName: string
    ): Promise<boolean> => {
      try {
        await dispatch(createAccount({ email, password, displayName })).unwrap()
      } catch (err) {
        pushError(err)
        return false
      }
      return true
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
