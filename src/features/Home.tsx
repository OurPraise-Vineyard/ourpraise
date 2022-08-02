import React, { useEffect } from 'react'
import ContentTable from '@features/Shared/Table'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { fetchPopularSongs, fetchRecentSongs } from '@features/Songs/songsSlice'
import { pushError } from '@utils/errorSlice'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id}`
  }
}

export default function Home () {
  useDocumentTitle('Home')
  const dispatch = useAppDispatch()
  const recentSongs = useAppSelector(state => state.songs.views.recent)
  const popularSongs = useAppSelector(state => state.songs.views.popular)
  const statusRecent = useAppSelector(state => state.songs.status.recent)
  const statusPopular = useAppSelector(state => state.songs.status.popular)

  useEffect(() => {
    try {
      if (statusRecent === 'idle' || statusRecent === 'failed') {
        dispatch(fetchRecentSongs()).unwrap()
      }
      if (statusPopular === 'idle' || statusPopular === 'failed') {
        dispatch(fetchPopularSongs()).unwrap()
      }
    } catch (err) {
      dispatch(pushError(err))
    }
  }, [dispatch, statusPopular, statusRecent])

  return (
    <div>
      <ContentTable mapper={mapSong} items={popularSongs} title="Most popular songs" />
      <ContentTable mapper={mapSong} items={recentSongs} title="Recently added songs" />
    </div>
  )
}
