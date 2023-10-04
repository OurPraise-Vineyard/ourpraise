import React, { useCallback, useEffect, useState } from 'react'
import ContentTable from '@components/ContentTable'
import Toolbar from '@components/Toolbar'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { fetchAllSongs, fetchSearchQuery } from '@state/songs/api'
import { FetchStatus } from '@utils/api'
import { pushError } from '@state/errorSlice'
import SearchSongs from '@components/SearchSongs'
import ToolbarSeparator from '@components/ToolbarSeparator'
import ToolbarButton from '@components/ToolbarButton'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id || data.objectID}`
  }
}

export default function Songs () {
  useDocumentTitle('Songs')
  const [query, setQuery] = useState('')
  const statusAllSongs = useAppSelector(state => state.songs.status.all)
  const songs = useAppSelector(state => state.songs.views.all)
  const hits = useAppSelector(state => state.songs.searchResults)
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.auth.user)

  const [searchStatus, setSearchStatus] = useState(FetchStatus.idle)

  useEffect(() => {
    if (statusAllSongs === FetchStatus.idle) {
      try {
        dispatch(fetchAllSongs()).unwrap()
      } catch (err) {
        dispatch(pushError(err))
      }
    }
  }, [dispatch, statusAllSongs])

  const handleSearch = useCallback(
    async query => {
      setQuery(query)
      if (!query) {
        setSearchStatus(FetchStatus.idle)
      } else {
        try {
          setSearchStatus(FetchStatus.loading)
          await dispatch(fetchSearchQuery(query)).unwrap()
          setSearchStatus(FetchStatus.succeeded)
        } catch (err) {
          dispatch(pushError(err))
          setSearchStatus(FetchStatus.failed)
        }
      }
    },
    [dispatch]
  )

  const handleSetSearchLoading = useCallback(
    value => {
      if (value && searchStatus !== FetchStatus.loading) {
        setSearchStatus(FetchStatus.loading)
      } else if (!value && searchStatus !== FetchStatus.idle) {
        setSearchStatus(FetchStatus.idle)
      }
    },
    [searchStatus]
  )

  const loading = searchStatus === FetchStatus.loading || statusAllSongs === FetchStatus.loading

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
