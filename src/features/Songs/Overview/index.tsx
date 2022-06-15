import React, { useCallback, useEffect, useState } from 'react'
import ContentTable from '@features/Shared/Table'
import Toolbar from '@features/Songs/Overview/Toolbar'
import { useAppDispatch, useAppSelector } from '@hooks'
import { fetchAllSongs, fetchSearchQuery } from '@features/Songs/songsSlice'
import { FetchStatus } from '@utils/api'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id || data.objectID}`
  }
}

export default function SongsOverview () {
  const [query, setQuery] = useState('')
  const statusAllSongs = useAppSelector(state => state.songs.status.all)
  const songs = useAppSelector(state => state.songs.views.all)
  const hits = useAppSelector(state => state.songs.searchResults)
  const dispatch = useAppDispatch()

  const [searchStatus, setSearchStatus] = useState(FetchStatus.idle)

  useEffect(() => {
    if (statusAllSongs !== FetchStatus.loading && statusAllSongs !== FetchStatus.succeeded) {
      dispatch(fetchAllSongs())
    }
  }, [dispatch, statusAllSongs])

  const handleSearch = useCallback(async (query) => {
    setQuery(query)
    if (!query) {
      setSearchStatus(FetchStatus.idle)
    } else {
      try {
        setSearchStatus(FetchStatus.loading)
        await dispatch(fetchSearchQuery(query))
        setSearchStatus(FetchStatus.succeeded)
      } catch (err) {
        setSearchStatus(FetchStatus.failed)
      }
    }
  }, [dispatch])

  const handleSetSearchLoading = useCallback((value) => {
    if (value && searchStatus !== FetchStatus.loading) {
      setSearchStatus(FetchStatus.loading)
    } else if (!value && searchStatus !== FetchStatus.idle) {
      setSearchStatus(FetchStatus.idle)
    }
  }, [searchStatus])

  const loading = searchStatus === FetchStatus.loading || statusAllSongs === FetchStatus.loading

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
