import { useEffect, useState } from 'react'

import { useAppDispatch } from '@hooks/state'
import { pushError } from '@state/errorSlice'

export type IFetchCreatorParams = Record<string, unknown>

export default function useFetch<T>(fn: () => Promise<T>): IFetchHookValue<T> {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<FetchStatus>('idle')
  const dispatch = useAppDispatch()

  useEffect(() => {
    ;(async () => {
      try {
        setStatus('loading')
        setData(await fn())
        setStatus('succeeded')
      } catch (err) {
        setStatus('failed')
        dispatch(pushError(err))
      }
    })()
  }, [dispatch, fn])

  return [status, data]
}
