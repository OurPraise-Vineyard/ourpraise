import { pushError } from '@state/errorSlice'
import { useAppDispatch } from '@hooks/state'
import { useEffect, useState } from 'react'

export type IFetchCreatorParams = Record<string, unknown>

export default function useFetch<T>(
  fn: (params: IFetchCreatorParams) => Promise<T>,
  params: IFetchCreatorParams
): IFetchHookValue<T> {
  const [data, setData] = useState<T>(null)
  const [status, setStatus] = useState<FetchStatus>('idle')
  const dispatch = useAppDispatch()

  useEffect(() => {
    ;(async () => {
      try {
        setStatus('loading')
        setData(await fn(params))
        setStatus('succeeded')
      } catch (err) {
        setStatus('failed')
        dispatch(pushError(err))
      }
    })()
  }, [dispatch, fn, params])

  return [status, data]
}
