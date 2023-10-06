import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Center from '@components/Center'
import FadeIn from '@components/FadeIn'
import useFetch, { IFetchCreatorParams } from '@hooks/useFetch'

export type IWithFetchProps<T> = { data: T }

export default function withFetch<T>(
  fn: (params: IFetchCreatorParams) => Promise<T>
) {
  return function (Comp: React.ComponentType<IWithFetchProps<T>>) {
    return function (props): JSX.Element {
      const params = useParams()
      const [status, data] = useFetch(fn, params as IFetchCreatorParams)
      const [showLoading, setShowLoading] = useState(false)

      useEffect(() => {
        const t = setTimeout(() => setShowLoading(true), 700)
        return () => clearTimeout(t)
      }, [status])

      if (status !== 'succeeded') {
        if (!showLoading) {
          return null
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
