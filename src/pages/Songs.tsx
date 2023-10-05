import React, { useCallback, useState } from 'react'
import ContentTable from '@components/ContentTable'
import Toolbar from '@components/Toolbar'
import { useAppDispatch } from '@hooks/state'
import { pushError } from '@state/errorSlice'
import SearchSongs from '@components/SearchSongs'
import ToolbarSeparator from '@components/ToolbarSeparator'
import ToolbarButton from '@components/ToolbarButton'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import { fetchSearchQuery, fetchSongs } from '@backend/songs'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id || data.objectID}`
  }
}

function Songs ({ data: songs }: IWithFetchProps<ISong[]>) {
  useDocumentTitle('Songs')
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState([])
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const [searchStatus, setSearchStatus] = useState<FetchStatus>('idle')

  const handleSearch = useCallback(
    async query => {
      setQuery(query)
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
    },
    [dispatch]
  )

  const handleSetSearchLoading = useCallback(
    value => {
      if (value && searchStatus !== 'loading') {
        setSearchStatus('loading')
      } else if (!value && searchStatus !== 'idle') {
        setSearchStatus('idle')
      }
    },
    [searchStatus]
  )

  const loading = searchStatus === 'loading'

  return (
    <div>
      <Toolbar>
        <SearchSongs onSearch={handleSearch} onChangeLoading={handleSetSearchLoading} />
        {user.role === 'admin' && (
          <>
            <ToolbarSeparator />
            <ToolbarButton to="/songs/add">Add new song</ToolbarButton>
          </>
        )}
      </Toolbar>
      <ContentTable
        mapper={mapSong}
        items={query ? hits : songs}
        title={query ? `Search results for "${query}"` : 'All songs'}
        loading={loading}
      />
    </div>
  )
}

export default withFetch<ISong[]>(fetchSongs)(Songs)
