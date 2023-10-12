import { useCallback, useEffect, useState } from 'react'

import useErrors from '@hooks/useErrors'

export type IFetchCreatorParams = Record<string, unknown>

export default function useFetch<T>(
  fn: () => Promise<T>,
  onFail?: IFailedFetchHandler
): IFetchHookValue<T> {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<FetchStatus>('idle')
  const [trigger, setTrigger] = useState(0)
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
        if (onFail) {
          onFail(err as IBackendError)
        }
      }
    })()
  }, [pushError, fn, onFail, trigger])

  const triggerFetch = useCallback(() => setTrigger(Date.now()), [])

  return [status, data, triggerFetch]
}
