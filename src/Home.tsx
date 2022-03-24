import { getRecommendedSongs } from 'api/songs'
import React, { useEffect, useState } from 'react'
import ContentTable from 'Shared/Table'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id}`
  }
}

export default function Home () {
  const [songs, setSongs] = useState([])

  useEffect(() => {
    getRecommendedSongs()
      .then(songs => setSongs(songs.map(mapSong)))
  }, [])

  return (
    <div>
      <ContentTable items={songs} title="Recently added songs" viewAllUrl="/songs" />
    </div>
  )
}
