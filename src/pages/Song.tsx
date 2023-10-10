import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import editIcon from '@assets/edit.svg'
import { fetchSong } from '@backend/songs'
import FlexGrow from '@blocks/FlexGrow'
import FlexRow from '@blocks/FlexRow'
import IconButton from '@blocks/IconButton'
import ToolbarButton from '@blocks/ToolbarButton'
import EllipsisText from '@blocks/text/EllipsisText'
import Monospace from '@blocks/text/Monospace'
import Title from '@blocks/text/Title'
import AddToEvent from '@components/AddToEvent'
import KeySwitcher from '@components/KeySwitcher'
import withFetch from '@components/withFetch'
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
      <FlexRow gap margin="16px 0 32px">
        <FlexGrow>
          <Title>{song.title}</Title>
          <EllipsisText width="30vw">{song.authors}</EllipsisText>
        </FlexGrow>
        {isAdmin && (
          <ToolbarButton onClick={() => setShowEventsDialog(true)}>
            Add to event
          </ToolbarButton>
        )}
        <FlexRow centered gap>
          <KeySwitcher
            transposeKey={transposeKey}
            setTransposeKey={setTransposeKey}
            onResetTranspose={handleResetTranspose}
            onToggleChords={handleToggleChords}
            showChords={showChords}
          />
          {isAdmin && <IconButton edge icon={editIcon} onClick={handleEdit} />}
        </FlexRow>
      </FlexRow>
      <Monospace>{formattedBody}</Monospace>
    </>
  )
}

export default withFetch<INoProps, ISong>(params =>
  fetchSong(params.songId as string)
)(Song)
