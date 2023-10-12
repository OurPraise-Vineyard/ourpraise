import { useAppDispatch, useAppSelector } from 'hooks/state'
import { useCallback } from 'react'
import { pushError } from 'state/errorSlice'

export default function useErrors() {
  const dispatch = useAppDispatch()
  const errors = useAppSelector(state => state.errors.stack)

  const handlePushError = useCallback(
    (err: unknown) => {
      dispatch(pushError(err))
    },
    [dispatch]
  )

  return {
    pushError: handlePushError,
    errors
  }
}
