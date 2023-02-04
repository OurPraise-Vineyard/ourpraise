import { searchSongs } from '@utils/algolia'
import Modal from '@features/Shared/Modal'
import SearchSongs from '@features/Shared/SearchSongs'
import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import ButtonBase from '@features/Shared/ButtonBase'
import { useAppDispatch, useAppSelector } from '@utils/hooks'
import { FetchStatus } from '@utils/api'
import { fetchSongList, fetchSongLists } from '@state/songLists/api'
import { pushError } from '@state/errorSlice'

interface Song {
  id: boolean
}

function mapSong(data, addedSongs: Array<Song>) {
  const id = data.objectID || data.id
  return {
    title: data.title,
    authors: data.authors,
    key: data.key,
    id,
    added: addedSongs.findIndex(song => song.id === id) > -1
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

  & > :nth-child(1) {
    align-self: end;
  }

  & > :nth-child(2) {
    align-self: start;
  }
`

const SongListItem = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: 'title actions';
  padding: 10px 0;
  top: -20px;
  position: sticky;
  background-color: white;
  z-index: 1;

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  & > :first-child {
    align-self: center;
  }
`

const PrimaryItemText = styled.div`
  font-size: 20px;
  font-weight: bold;
  grid-area: title;
`

const SecondaryItemText = styled.div`
  font-size: 18px;
  color: ${props => props.theme.colors.textFaded};
  grid-area: authors;
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

const SongListSongs = styled.div`
  grid-column: 1/3;
  padding-left: 40px;
  & > :last-child {
    margin-bottom: 20px;
  }
`

const StickyContainer = styled.div`
  position: relative;
`

function AddSongsContent({ show, addedSongs: externalAddedSongs, onAddSong }) {
  const [addedSongs, setAddedSongs] = useState([])
  const [loading, setLoading] = useState(false)
  const [hits, setHits] = useState([])
  const [query, setQuery] = useState('')
  const dispatch = useAppDispatch()
  const songLists = useAppSelector(state => state.songLists.songLists)
  const statusSongLists = useAppSelector(state => state.songLists.statusSongLists)
  const [selectedList, setSelectedList] = useState<string>(null)
  const selectedListData = useAppSelector(state => state.songLists.index[selectedList])
  const searchInput = useRef<HTMLInputElement | null>(null)
  const selectedListLoading = !!selectedListData

  const selectedListSongs = useMemo(() => {
    if (selectedListData) {
      return selectedListData.songs.map(song => mapSong(song, addedSongs))
    }
    return null
  }, [selectedListData, addedSongs])

  useEffect(() => {
    if (show) {
      setAddedSongs(externalAddedSongs)
      setSelectedList(null)
      setQuery('')
      setHits([])
      setLoading(false)
      searchInput.current.value = ''
    }
    /* eslint-disable-next-line */
  }, [show])

  useEffect(() => {
    if (statusSongLists === FetchStatus.idle) {
      dispatch(fetchSongLists())
        .unwrap()
        .catch(err => {
          dispatch(pushError(err))
        })
    }
  }, [statusSongLists, dispatch])

  useEffect(() => {
    if (selectedList && !selectedListLoading) {
      dispatch(fetchSongList(selectedList))
        .unwrap()
        .catch(err => dispatch(pushError(err)))
    }
  }, [dispatch, selectedList, selectedListLoading])

  const handleSearch = useCallback(
    async query => {
      if (query) {
        const hits = await searchSongs(query)
        setHits(hits.map(hit => mapSong(hit, addedSongs)))
        setSelectedList(null)
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
    setAddedSongs(addedSongs.concat([song]))
    onAddSong(song)
  }

  const handleViewSongList = songListId => {
    if (songListId === selectedList) {
      setSelectedList(null)
    } else {
      setSelectedList(songListId)
    }
  }

  useEffect(() => {
    if (show) {
      if (searchInput.current) searchInput.current.select()
    }
  }, [show])

  let body: ReactElement = null
  if (loading || (query.length === 0 && statusSongLists === FetchStatus.loading)) {
    body = <Text>Loading...</Text>
  } else if (query.length > 0) {
    body = (
      <>
        <Text>Found {hits.length} songs:</Text>
        {hits.map(song => (
          <AddSongItem key={song.id}>
            <PrimaryItemText>{song.title}</PrimaryItemText>
            <SecondaryItemText>{song.authors}</SecondaryItemText>
            {song.added ? (
              <Added>Added</Added>
            ) : (
              <Action onClick={() => handleAddSong(song)}>Add song</Action>
            )}
          </AddSongItem>
        ))}
      </>
    )
  } else {
    body = (
      <>
        <Text>Select from song lists:</Text>
        {songLists.map(songList => (
          <StickyContainer key={songList.id}>
            <SongListItem>
              <PrimaryItemText>{songList.name}</PrimaryItemText>
              <Action onClick={() => handleViewSongList(songList.id)}>
                {selectedList === songList.id ? 'Hide songs' : 'View songs'}
              </Action>
            </SongListItem>
            <SongListSongs>
              {selectedList === songList.id && !selectedListSongs && (
                <Text>Loading song list...</Text>
              )}
              {selectedList === songList.id &&
                !!selectedListSongs &&
                selectedListSongs.map(song => (
                  <AddSongItem key={song.id}>
                    <PrimaryItemText>{song.title}</PrimaryItemText>
                    <SecondaryItemText>{song.authors}</SecondaryItemText>
                    {song.added ? (
                      <Added>Added</Added>
                    ) : (
                      <Action onClick={() => handleAddSong(song)}>Add song</Action>
                    )}
                  </AddSongItem>
                ))}
            </SongListSongs>
          </StickyContainer>
        ))}
      </>
    )
  }

  return (
    <>
      <SearchSongs onChangeLoading={setLoading} onSearch={handleSearch} inputRef={searchInput} />
      {body}
    </>
  )
}

export default function AddSongs({ show, onClose, addedSongs, onAddSong }) {
  return (
    <Modal onClose={onClose} show={show} title="Add songs">
      <AddSongsContent show={show} addedSongs={addedSongs} onAddSong={onAddSong} />
    </Modal>
  )
}
