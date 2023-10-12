import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AddToEvent from '@components/AddToEvent'
import KeySwitcher from '@components/KeySwitcher'
import withFetch from '@components/withFetch'

import Block from '@blocks/Block'
import IconButton from '@blocks/IconButton'
import ToolbarButton from '@blocks/ToolbarButton'
import EllipsisText from '@blocks/text/EllipsisText'
import Monospace from '@blocks/text/Monospace'
import Title from '@blocks/text/Title'

import editIcon from '@assets/edit.svg'
import { fetchSong } from '@backend/songs'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useFormattedSongBody from '@hooks/useFormattedSongBody'

function Song({ data: song }: { data: ISong }) {
  const { songId } = useParams()
  const [transposeKey, setTransposeKey] = useState<IKey>(song.key)
  const [showChords, setShowChords] = useState(true)
  const [showEventsDialog, setShowEventsDialog] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const formattedBody = useFormattedSongBody(song, showChords, transposeKey)
  useDocumentTitle(song.title)

  const isAdmin = user?.role === 'admin'

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
    <>
      {isAdmin && (
        <AddToEvent
          show={showEventsDialog}
          onClose={() => setShowEventsDialog(false)}
          songId={song.id}
          songKey={transposeKey}
        />
      )}
      <Block flex="row" gap="12px" margin="16px 0 32px">
        <Block grow>
          <Title>{song.title}</Title>
          <EllipsisText width="30vw">{song.authors}</EllipsisText>
        </Block>
        {isAdmin && (
          <ToolbarButton onClick={() => setShowEventsDialog(true)}>
            Add to event
          </ToolbarButton>
        )}
        <Block flex="row" align="center" gap="12px">
          <KeySwitcher
            transposeKey={transposeKey}
            setTransposeKey={setTransposeKey}
            onResetTranspose={handleResetTranspose}
            onToggleChords={handleToggleChords}
            showChords={showChords}
          />
          {isAdmin && <IconButton edge icon={editIcon} onClick={handleEdit} />}
        </Block>
      </Block>
      <Monospace padding="0 0 64px">{formattedBody}</Monospace>
    </>
  )
}

export default withFetch<INoProps, ISong>(params =>
  fetchSong(params.songId as string)
)(Song)
