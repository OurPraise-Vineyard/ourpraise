import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import editIcon from '@assets/edit.svg'
import { fetchSong } from '@backend/songs'
import IconButton from '@components/IconButton'
import KeySwitcher from '@components/KeySwitcher'
import Toolbar from '@components/Toolbar'
import withFetch from '@components/withFetch'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
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

function Song({ data: song }: { data: ISong }) {
  const { songId } = useParams()
  const [transposeKey, setTransposeKey] = useState<IKey | null>(song.key)
  const [showChords, setShowChords] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()
  const formattedBody = useFormattedSongBody(song, showChords, transposeKey)
  useDocumentTitle(song.title)

  const isAdmin = user.role === 'admin'

  function handleEdit() {
    navigate(`/songs/${songId}/edit`)
  }

  const handleResetTranspose = () => {
    setTransposeKey(song.key)
  }

  function handleToggleChords() {
    setShowChords(!showChords)
  }

  return (
    <div>
      <Toolbar>
        {isAdmin && <IconButton icon={editIcon} onClick={handleEdit} />}
      </Toolbar>
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

export default withFetch<ISong>(params => fetchSong(params.songId as string))(
  Song
)
