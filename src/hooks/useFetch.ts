import { useEffect, useState } from 'react'

import useErrors from '@hooks/useErrors'

export type IFetchCreatorParams = Record<string, unknown>

export default function useFetch<T>(fn: () => Promise<T>): IFetchHookValue<T> {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<FetchStatus>('idle')
  const { pushError } = useErrors()

  useEffect(() => {
    ;(async () => {
      try {
        setStatus('loading')
        setData(await fn())
        setStatus('succeeded')
      } catch (err) {
        setStatus('failed')
        pushError(err)
      }
    })()
  }, [pushError, fn])

  return [status, data]
}
