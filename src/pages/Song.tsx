import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { fetchSong } from '@state/songs/api'
import { pushError } from '@state/errorSlice'
import IconButton from '@components/IconButton'
import editIcon from '@assets/edit.svg'
import Toolbar from '@components/Toolbar'
import KeySwitcher from '@components/KeySwitcher'
import useFormattedSongBody from '@hooks/useFormattedSongBody'

const Container = styled.div`
  box-shadow: ${props => props.theme.boxShadow};
  background-color: white;
  padding: 20px;
  overflow-x: auto;
  max-width: 100%;
`

const Title = styled.h1`
  font-size: 36px;
  margin: 0;
  grid-area: title;
`

const Authors = styled.h2`
  font-size: 20px;
  color: ${props => props.theme.colors.textFaded};
  margin: 0;
  grid-area: authors;
`

const SongBody = styled.div`
  font-family: 'Oxygen Mono', monospace;
  margin: 16px 0;
  white-space: pre;
`

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 'title chords' 'authors chords';
`

export default function ViewSong () {
  const { songId } = useParams()
  const [transposeKey, setTransposeKey] = useState<IKey | null>(null)
  const [showChords, setShowChords] = useState(true)
  const navigate = useNavigate()
  const song = useAppSelector(state => state.songs.index[songId])
  const isAdmin = useAppSelector(state => state.auth.user.role === 'admin')
  const dispatch = useAppDispatch()
  const formattedBody = useFormattedSongBody(song, showChords, transposeKey)
  useDocumentTitle(song ? song.title : '')

  const songLoaded = song && song.id === songId
  const songKey = song && song.key

  useEffect(() => {
    ;(async () => {
      try {
        await dispatch(fetchSong(songId)).unwrap()
      } catch (err) {
        dispatch(pushError(err))
      }
    })()
  }, [songId, dispatch])

  useEffect(() => setTransposeKey(songKey || null), [songKey])

  function handleEdit () {
    navigate(`/songs/${songId}/edit`)
  }

  const handleResetTranspose = () => {
    setTransposeKey(song.key)
  }

  function handleToggleChords () {
    setShowChords(!showChords)
  }

  if (!songLoaded) {
    return null
  }

  return (
    <div>
      <Toolbar>{isAdmin && <IconButton icon={editIcon} onClick={handleEdit} />}</Toolbar>
      <Container>
        <Header>
          <Title>{song.title}</Title>
          <KeySwitcher
            transposeKey={transposeKey}
            setTransposeKey={setTransposeKey}
            onResetTranspose={handleResetTranspose}
            onToggleChords={handleToggleChords}
            showChords={showChords}
          />
          <Authors>{song.authors}</Authors>
        </Header>
        <SongBody>{formattedBody}</SongBody>
      </Container>
    </div>
  )
}
