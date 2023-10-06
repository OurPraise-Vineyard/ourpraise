import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@hooks/state'
import { initializeUser } from '@state/authSlice'
import { pushError } from '@state/errorSlice'

type IAuthHook = {
  user: IUser | null
  ready: boolean
}
export default function useAuth(): IAuthHook {
  const user = useAppSelector(state => state.auth.user)
  const ready = useAppSelector(state => state.auth.status !== 'undetermined')
  const dispatch = useAppDispatch()

  useEffect(
    function () {
      if (ready) {
        console.log('User already initialized, not doing anything')
        return
      }

      try {
        dispatch(initializeUser()).unwrap()
      } catch (err) {
        dispatch(pushError(err))
      }
    },
    [dispatch, ready]
  )

  return { user, ready }
}
