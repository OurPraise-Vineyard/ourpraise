import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import styled from 'styled-components'

import { fetchSongLists } from '@backend/songLists'
import { fetchSearchQuery } from '@backend/songs'
import ButtonBase from '@components/ButtonBase'
import Modal from '@components/Modal'
import SearchSongs from '@components/SearchSongs'
import withFetch, { IWithFetchProps } from '@components/withFetch'

function mapSong(data, addedSongs: Array<ISong>) {
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
  font-size: ${props => props.theme.fontSizes.regular};
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

const PrimaryItemText = styled.div`
  font-size: ${props => props.theme.fontSizes.regular};
  font-weight: bold;
  grid-area: title;
`

const SecondaryItemText = styled.div`
  font-size: ${props => props.theme.fontSizes.regular};
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
  font-size: ${props => props.theme.fontSizes.regular};
  grid-area: actions;
  justify-self: end;
  align-self: center;
`

type AddSongsContentProps = IWithFetchProps<ISongList[]> & {
  show: boolean
  addedSongs: ISongList[]
  onAddSong: (song: ISong) => void
}

const AddSongsContent = withFetch<ISongList[]>(fetchSongLists)(function ({
  show,
  addedSongs: externalAddedSongs,
  onAddSong
}: AddSongsContentProps) {
  const [addedSongs, setAddedSongs] = useState([])
  const [loading, setLoading] = useState(false)
  const [hits, setHits] = useState([])
  const [query, setQuery] = useState('')
  const searchInput = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (show) {
      setAddedSongs(externalAddedSongs)
      setQuery('')
      setHits([])
      setLoading(false)
      searchInput.current.value = ''
    }
    /* eslint-disable-next-line */
  }, [show])

  const handleSearch = useCallback(
    async query => {
      if (query) {
        const hits = await fetchSearchQuery(query)
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
    setAddedSongs(addedSongs.concat([song]))
    onAddSong(song)
  }

  useEffect(() => {
    if (show) {
      if (searchInput.current) searchInput.current.select()
    }
  }, [show])

  let body: ReactElement = null
  if (loading /*&& statusSongLists === FetchStatus.loading */) {
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
    body = <Text>Search songs to add them</Text>
  }

  return (
    <>
      <SearchSongs
        onChangeLoading={setLoading}
        onSearch={handleSearch}
        inputRef={searchInput}
      />
      {body}
    </>
  )
})

type AddSongsProps = {
  show: boolean
  onClose: () => void
  addedSongs: ISongList[]
  onAddSong: (song: ISong) => void
}
export default function AddSongs({
  show,
  onClose,
  addedSongs,
  onAddSong
}: AddSongsProps) {
  return (
    <Modal onClose={onClose} show={show} title="Add songs">
      <AddSongsContent
        show={show}
        addedSongs={addedSongs}
        onAddSong={onAddSong}
      />
    </Modal>
  )
}
