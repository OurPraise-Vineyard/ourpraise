import { streamRecommendedSongs } from 'api/songs'
import HomeTable from 'Home/Table'
import React, { useEffect, useState } from 'react'

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
    const stream = streamRecommendedSongs()
      .subscribe(songs => setSongs(songs.map(mapSong)))

    return () => stream.unsubscribe()
  }, [])

  return (
    <div>
      <HomeTable items={songs} title="Recently added songs" viewAllUrl="/songs" />
    </div>
  )
}
