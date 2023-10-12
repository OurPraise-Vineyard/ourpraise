import { fetchSearchQuery } from 'backend/songs'
import useErrors from 'hooks/useErrors'
import { useEffect, useState } from 'react'

export default function useSearchSongs(query: string): [FetchStatus, ISong[]] {
  const [hits, setHits] = useState<ISong[]>([])
  const [searchStatus, setSearchStatus] = useState<FetchStatus>('idle')
  const { pushError } = useErrors()

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
          pushError(err)
          setSearchStatus('failed')
        }
      }
    }

    search()
  }, [query, pushError])

  return [searchStatus, hits]
}
