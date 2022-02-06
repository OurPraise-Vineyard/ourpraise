import { getAllSongs } from 'api/songs'
import React, { useEffect, useState } from 'react'
import ContentTable from 'Shared/Table'
import Toolbar from 'Songs/Toolbar'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id}`
  }
}

export default function Songs () {
  const [songs, setSongs] = useState([])

  useEffect(() => {
    getAllSongs()
      .then(songs => setSongs(songs.map(mapSong)))
  }, [])

  return (
    <div>
      <Toolbar />
      <ContentTable items={songs} title="All songs" />
    </div>
  )
}
