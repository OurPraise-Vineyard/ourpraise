import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import editIcon from '@assets/edit.svg'
import { fetchSong } from '@backend/songs'
import IconButton from '@components/IconButton'
import KeySwitcher from '@components/KeySwitcher'
import Paragraph from '@components/text/Paragraph'
import Title from '@components/text/Title'
import withFetch from '@components/withFetch'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useFormattedSongBody from '@hooks/useFormattedSongBody'

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
  align-items: center;
  gap: 12px;
`

const Column = styled.div`
  flex: 1 0 auto;
  margin: 16px 0;
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
      <Row>
        <Column>
          <Title>{song.title}</Title>
          <Authors>{song.authors}</Authors>
        </Column>
        <Row>
          <KeySwitcher
            transposeKey={transposeKey}
            setTransposeKey={setTransposeKey}
            onResetTranspose={handleResetTranspose}
            onToggleChords={handleToggleChords}
            showChords={showChords}
          />
          {isAdmin && <IconButton icon={editIcon} onClick={handleEdit} />}
        </Row>
      </Row>
      <SongBody>{formattedBody}</SongBody>
    </div>
  )
}

export default withFetch<ISong>(params => fetchSong(params.songId as string))(
  Song
)
