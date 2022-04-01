import { getAllSongs } from '@api/songs'
import React, { useCallback, useEffect, useState } from 'react'
import ContentTable from '@Shared/Table'
import Toolbar from '@Songs/Toolbar'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id || data.objectID}`
  }
}

export default function Songs () {
  const [songs, setSongs] = useState([])
  const [hits, setHits] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllSongs()
      .then(songs => setSongs(songs.map(mapSong)))
  }, [])

  const handleLoadHits = useCallback((hits, query) => {
    setHits(hits.map(mapSong))
    setQuery(query)
  }, [])

  return (
    <div>
      <Toolbar onLoadHits={handleLoadHits} onChangeLoading={setLoading} />
      <ContentTable
        items={query ? hits : songs}
        title={query ? `Search results for "${query}"` : 'All songs'}
        loading={loading}
      />
    </div>
  )
}
