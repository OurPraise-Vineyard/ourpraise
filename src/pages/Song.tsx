import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import editIcon from '@assets/edit.svg'
import { fetchSong } from '@backend/songs'
import AddToEvent from '@components/AddToEvent'
import IconButton from '@components/IconButton'
import KeySwitcher from '@components/KeySwitcher'
import ToolbarButton from '@components/ToolbarButton'
import Paragraph from '@components/text/Paragraph'
import Title from '@components/text/Title'
import withFetch from '@components/withFetch'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useFormattedSongBody from '@hooks/useFormattedSongBody'

const Container = styled.div`
  margin-top: 16px;
`

const Authors = styled(Paragraph)`
  color: ${props => props.theme.colors.textFaded};
  margin: 0;
`

const SongBody = styled.div`
  font-family: 'Oxygen Mono', monospace;
  margin: 16px 0 64px;
  white-space: pre;
  font-size: ${props => props.theme.fontSizes.small};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`

const Column = styled.div`
  flex: 1 0 auto;
  margin: 0 0 16px;
`

const Centered = styled(Row)`
  align-items: center;
  height: ${props => props.theme.sizes.toolbarHeight};
`

function Song({ data: song }: { data: ISong }) {
  const { songId } = useParams()
  const [transposeKey, setTransposeKey] = useState<IKey | null>(song.key)
  const [showChords, setShowChords] = useState(true)
  const [showEventsDialog, setShowEventsDialog] = useState(false)
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
    <Container>
      <AddToEvent
        show={showEventsDialog}
        onClose={() => setShowEventsDialog(false)}
        song={song}
      />
      <Row>
        <Column>
          <Title>{song.title}</Title>
          <Authors>{song.authors}</Authors>
        </Column>
        {isAdmin && (
          <ToolbarButton onClick={() => setShowEventsDialog(true)}>
            Add to event
          </ToolbarButton>
        )}
        <Centered>
          <KeySwitcher
            transposeKey={transposeKey}
            setTransposeKey={setTransposeKey}
            onResetTranspose={handleResetTranspose}
            onToggleChords={handleToggleChords}
            showChords={showChords}
          />
          {isAdmin && <IconButton icon={editIcon} onClick={handleEdit} />}
        </Centered>
      </Row>
      <SongBody>{formattedBody}</SongBody>
    </Container>
  )
}

export default withFetch<ISong>(params => fetchSong(params.songId as string))(
  Song
)
