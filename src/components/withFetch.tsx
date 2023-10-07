import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Center from '@components/Center'
import FadeIn from '@components/FadeIn'
import useFetch, { IFetchCreatorParams } from '@hooks/useFetch'

export type IWithFetchProps<T> = { data: T }

export default function withFetch<Props, Data>(
  fn: (params: IFetchCreatorParams) => Promise<Data>
) {
  return function (Comp: React.ComponentType<Props & IWithFetchProps<Data>>) {
    return function (props: Props): JSX.Element {
      const params = useParams()
      const fnWithParams = useCallback(() => fn(params), [params])
      const [status, data] = useFetch(fnWithParams)
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
          <Comp data={data} {...props} />
        </FadeIn>
      )
    }
  }
}
