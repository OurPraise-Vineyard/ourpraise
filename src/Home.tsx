import React, { useEffect } from 'react'
import ContentTable from '@Shared/Table'
import { useAppDispatch, useAppSelector } from '@hooks'
import { fetchPopularSongs, fetchRecentSongs } from '@slices/home'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id}`
  }
}

export default function Home () {
  const dispatch = useAppDispatch()
  const recentSongs = useAppSelector(state => state.home.recentSongs)
  const popularSongs = useAppSelector(state => state.home.popularSongs)
  const statusRecent = useAppSelector(state => state.home.statusRecent)
  const statusPopular = useAppSelector(state => state.home.statusPopular)

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
