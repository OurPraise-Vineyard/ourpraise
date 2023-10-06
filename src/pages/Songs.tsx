import React, { useCallback, useState } from 'react'

import { fetchSearchQuery, fetchSongs } from '@backend/songs'
import Center from '@components/Center'
import CompactListItem from '@components/CompactListItem'
import SearchSongs from '@components/SearchSongs'
import Toolbar from '@components/Toolbar'
import ToolbarButton from '@components/ToolbarButton'
import ToolbarSeparator from '@components/ToolbarSeparator'
import Title from '@components/text/Title'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import { useAppDispatch } from '@hooks/state'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { pushError } from '@state/errorSlice'

function Songs({ data: songs }: IWithFetchProps<ISong[]>) {
  useDocumentTitle('Songs')
  const [query, setQuery] = useState<string>('')
  const [hits, setHits] = useState<ISong[]>([])
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const [searchStatus, setSearchStatus] = useState<FetchStatus>('idle')

  const items = query ? hits : songs

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
        <Title>{query ? `Search results for "${query}"` : 'All songs'}</Title>
        <SearchSongs
          onSearch={handleSearch}
          onChangeLoading={handleSetSearchLoading}
        />
        {user.role === 'admin' && (
          <>
            <ToolbarSeparator />
            <ToolbarButton to="/songs/add">Add new song</ToolbarButton>
          </>
        )}
      </Toolbar>
      {loading ? (
        <Center>Loading...</Center>
      ) : (
        <div>
          {items.map(song => (
            <CompactListItem
              to={`/songs/${song.id}`}
              primary={song.title}
              secondary={song.authors}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default withFetch<ISong[]>(fetchSongs)(Songs)
