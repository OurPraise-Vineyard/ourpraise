import React, { useCallback, useEffect, useState } from 'react'
import ContentTable from '@Shared/Table'
import Toolbar from '@Songs/Toolbar'
import { useAppDispatch, useAppSelector } from '@hooks'
import { fetchAllSongs, fetchSearchQuery, setSearchStatus } from '@slices/songs'
import { FetchStatus } from '@slices/utils'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id || data.objectID}`
  }
}

export default function Songs () {
  const [query, setQuery] = useState('')
  const statusAllSongs = useAppSelector(state => state.songs.statusAllSongs)
  const statusSearch = useAppSelector(state => state.songs.statusSearch)
  const songs = useAppSelector(state => state.songs.allSongs)
  const hits = useAppSelector(state => state.songs.searchResults)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (statusAllSongs !== FetchStatus.loading && statusAllSongs !== FetchStatus.succeeded) {
      dispatch(fetchAllSongs())
    }
  }, [dispatch, statusAllSongs])

  const handleSearch = useCallback((query) => {
    if (!query) {
      dispatch(setSearchStatus(FetchStatus.idle))
    } else {
      dispatch(fetchSearchQuery(query))
    }
    setQuery(query)
  }, [dispatch])

  const handleSetSearchLoading = useCallback((value) => {
    if (value && statusSearch !== FetchStatus.loading) {
      dispatch(setSearchStatus(FetchStatus.loading))
    } else if (!value && statusSearch !== FetchStatus.idle) {
      dispatch(setSearchStatus(FetchStatus.idle))
    }
  }, [dispatch, statusSearch])

  const loading = statusSearch === FetchStatus.loading || statusAllSongs === FetchStatus.loading

  return (
    <div>
      <Toolbar onSearch={handleSearch} onChangeLoading={handleSetSearchLoading} />
      <ContentTable
        mapper={mapSong}
        items={query ? hits : songs}
        title={query ? `Search results for "${query}"` : 'All songs'}
        loading={loading}
      />
    </div>
  )
}
