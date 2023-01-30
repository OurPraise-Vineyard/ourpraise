import { searchSongs } from '@utils/algolia'
import Modal from '@features/Shared/Modal'
import SearchSongs from '@features/Shared/SearchSongs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ButtonBase from '@features/Shared/ButtonBase'

interface Song {
  id: boolean
}

function mapSong(data, addedSongs: Array<Song>) {
  return {
    title: data.title,
    authors: data.authors,
    key: data.key,
    id: data.objectID,
    added: addedSongs.findIndex(song => song.id === data.objectID) > -1
  }
}

const Text = styled.div`
  font-size: 20px;
  text-align: center;
  padding: 20px;
`

const AddSongItem = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 'title actions' 'authors actions';
  padding: 10px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`

const SongTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  grid-area: title;
  align-self: end;
`

const SongAuthors = styled.div`
  font-size: 18px;
  color: ${props => props.theme.colors.textFaded};
  grid-area: authors;
  align-self: start;
`

const Action = styled(ButtonBase)`
  margin: 0;
  grid-area: actions;
  justify-self: end;
  align-self: center;
`

const Added = styled.div`
  font-size: 20px;
  grid-area: actions;
  justify-self: end;
  align-self: center;
`

const defaultAddedSongs = []
export default function AddSongs({ show, onClose, addedSongs = defaultAddedSongs, onAddSong }) {
  const [loading, setLoading] = useState(false)
  const [hits, setHits] = useState([])
  const [query, setQuery] = useState('')

  const handleSearch = useCallback(
    async query => {
      if (query) {
        const hits = await searchSongs(query)
        setHits(hits.map(hit => mapSong(hit, addedSongs)))
      } else {
        setHits([])
      }
      setQuery(query)
      setLoading(false)
    },
    [addedSongs]
  )

  const handleAddSong = async song => {
    setHits(
      hits.map(hit =>
        hit.id === song.id
          ? {
              ...hit,
              added: true
            }
          : hit
      )
    )
    onAddSong(song)
  }

  const searchInput = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (show) {
      if (searchInput.current) searchInput.current.select()
    }
  }, [show])

  return (
    <Modal onClose={onClose} show={show} title="Add songs">
      <SearchSongs onChangeLoading={setLoading} onSearch={handleSearch} inputRef={searchInput} />
      {query.length > 0 && !loading && <Text>Found {hits.length} songs:</Text>}
      {loading && <Text>Loading...</Text>}
      {hits.map(song => (
        <AddSongItem key={song.id}>
          <SongTitle>{song.title}</SongTitle>
          <SongAuthors>{song.authors}</SongAuthors>
          {song.added ? (
            <Added>Added</Added>
          ) : (
            <Action onClick={() => handleAddSong(song)}>Add song</Action>
          )}
        </AddSongItem>
      ))}
    </Modal>
  )
}
