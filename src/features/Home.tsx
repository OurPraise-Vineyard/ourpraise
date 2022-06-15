import React, { useEffect } from 'react'
import ContentTable from '@features/Shared/Table'
import { useAppDispatch, useAppSelector } from '@hooks'
import { fetchPopularSongs, fetchRecentSongs } from '@features/Songs/songsSlice'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id}`
  }
}

export default function Home () {
  const dispatch = useAppDispatch()
  const recentSongs = useAppSelector(state => state.songs.views.recent)
  const popularSongs = useAppSelector(state => state.songs.views.popular)
  const statusRecent = useAppSelector(state => state.songs.status.recent)
  const statusPopular = useAppSelector(state => state.songs.status.popular)

  useEffect(() => {
    if (statusRecent === 'idle' || statusRecent === 'failed') {
      dispatch(fetchRecentSongs())
    }
    if (statusPopular === 'idle' || statusPopular === 'failed') {
      dispatch(fetchPopularSongs())
    }
  }, [dispatch, statusPopular, statusRecent])

  return (
    <div>
      <ContentTable mapper={mapSong} items={popularSongs} title="Most popular songs" />
      <ContentTable mapper={mapSong} items={recentSongs} title="Recently added songs" />
    </div>
  )
}
