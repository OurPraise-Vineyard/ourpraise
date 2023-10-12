import Center from 'blocks/Center'
import FadeIn from 'blocks/FadeIn'
import useFetch, { IFetchCreatorParams } from 'hooks/useFetch'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export type IWithFetchProps<T> = { data: T; onTriggerFetch: () => void }

export default function withFetch<Props, Data>(
  fn: (params: IFetchCreatorParams) => Promise<Data>
) {
  return function (Comp: React.ComponentType<Props & IWithFetchProps<Data>>) {
    return function (props: Props): JSX.Element {
      const params = useParams()
      const fnWithParams = useCallback(() => fn(params), [params])
      const [status, data, triggerFetch] = useFetch(fnWithParams)
      const [showLoading, setShowLoading] = useState(false)

      useEffect(() => {
        const t = setTimeout(() => setShowLoading(true), 700)
        return () => clearTimeout(t)
      }, [status])

      if (status !== 'succeeded' || !data) {
        if (!showLoading) {
          return <></>
        }

        return <Center>Loading...</Center>
      }

      return (
        <FadeIn>
          <Comp data={data} onTriggerFetch={triggerFetch} {...props} />
        </FadeIn>
      )
    }
  }
}
