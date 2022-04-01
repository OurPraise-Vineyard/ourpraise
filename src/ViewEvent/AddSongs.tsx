import { addSongToEvent } from '@api/events'
import Modal from '@Shared/Modal'
import SearchSongs from '@Shared/SearchSongs'
import SongItem from '@ViewEvent/SongItem'
import React, { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

interface Song {
  id: boolean
}

function mapSong (data, addedSongs: Array<Song>) {
  return {
    title: data.title,
    authors: data.authors,
    id: data.id,
    added: addedSongs.findIndex(song => song.id === data.id) > -1
  }
}

const Text = styled.div`
  font-size: 20px;
  text-align: center;
  padding: 20px;
`

const defaultAddedSongs = []
export default function AddSongs ({ addedSongs = defaultAddedSongs, onRefreshEvent }) {
  const navigate = useNavigate()
  const { eventId, state } = useParams()
  const [loading, setLoading] = useState(false)
  const [hits, setHits] = useState([])
  const [query, setQuery] = useState('')

  const handleLoadHits = useCallback((hits, query) => {
    setHits(hits.map(hit => mapSong(hit, addedSongs)))
    setQuery(query)
  }, [addedSongs])

  const handleAddSong = async (songId) => {
    setHits(hits.map(hit => hit.id === songId
      ? ({
        ...hit,
        added: true
      })
      : hit))
    await addSongToEvent(eventId, songId)
    onRefreshEvent()
  }

  return (
    <Modal
        onClose={() => navigate(`/events/${eventId}`)}
        show={state === 'addsongs'}
        title="Add songs"
      >
        <SearchSongs
          onChangeLoading={setLoading}
          onLoadHits={handleLoadHits}
        />
        {query.length > 0 && !loading && (
          <Text>Found {hits.length} songs:</Text>
        )}
        {loading && (
          <Text>Loading...</Text>
        )}
        {hits.map((song) => (
          <SongItem key={song.id} song={song} onAdd={() => handleAddSong(song.id)} />
        ))}
      </Modal>
  )
}
