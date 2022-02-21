import { getAllSongs } from 'api/songs'
import React, { useEffect, useState } from 'react'
import ContentTable from 'Shared/Table'
import Toolbar from 'Songs/Toolbar'
import { searchSongs } from 'api/algolia'
import { createDebouncer } from 'debouncer'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id || data.objectID}`
  }
}

const debounce = createDebouncer(1000)

export default function Songs () {
  const [songs, setSongs] = useState([])
  const [hits, setHits] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllSongs()
      .then(songs => setSongs(songs.map(mapSong)))
  }, [])

  useEffect(() => {
    if (query) {
      searchSongs(query).then(hits => setHits(hits.map(mapSong)))
    }
    setLoading(false)
  }, [query])

  function debounceSearch (q) {
    if (q === query) {
      setLoading(false)
    } else {
      setLoading(true)
    }

    debounce(() => setQuery(q))
  }

  return (
    <div>
      <Toolbar
        onSearch={debounceSearch}
      />
      <ContentTable
        items={query ? hits : songs}
        title={query ? `Search results for ${query}` : 'All songs'}
        loading={loading}
      />
    </div>
  )
}
