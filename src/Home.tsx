import { getRecentSongs, getRecommendedSongs } from '@api/songs'
import React, { useEffect, useState } from 'react'
import ContentTable from '@Shared/Table'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id}`
  }
}

export default function Home () {
  const [recentSongs, setRecentSongs] = useState([])
  const [popularSongs, setPopularSongs] = useState([])

  useEffect(() => {
    getRecommendedSongs()
      .then(songs => setPopularSongs(songs.map(mapSong)))
    getRecentSongs()
      .then(songs => setRecentSongs(songs.map(mapSong)))
  }, [])

  return (
    <div>
      <ContentTable items={popularSongs} title="Most popular songs" />
      <ContentTable items={recentSongs} title="Recently added songs" />
    </div>
  )
}
