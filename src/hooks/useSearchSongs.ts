import { useEffect, useState } from 'react'

import { fetchSearchQuery } from '@backend/songs'
import { useAppDispatch } from '@hooks/state'
import { pushError } from '@state/errorSlice'

export default function useSearchSongs(query: string): [FetchStatus, ISong[]] {
  const [hits, setHits] = useState<ISong[]>([])
  const [searchStatus, setSearchStatus] = useState<FetchStatus>('idle')
  const dispatch = useAppDispatch()

  useEffect(() => {
    async function search() {
      if (!query) {
        setSearchStatus('idle')
      } else {
        try {
          setSearchStatus('loading')
          setHits(await fetchSearchQuery(query))
          setSearchStatus('succeeded')
        } catch (err) {
          dispatch(pushError(err))
          setSearchStatus('failed')
        }
      }
    }

    search()
  }, [query, dispatch])

  return [searchStatus, hits]
}
