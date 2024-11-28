import { ellipsisTextStyles, pageTitleStyles } from '@common-styles'
import classNames from 'classnames'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from 'styled-components'

import AddToEvent from '@components/AddToEvent'
import Button from '@components/Button'
import IconButton from '@components/IconButton'
import KeySwitcher from '@components/KeySwitcher'
import withFetch from '@components/withFetch'

import editIcon from '@assets/edit.svg'
import { fetchSong } from '@backend/songs'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useFormattedSongBody from '@hooks/useFormattedSongBody'

function Song({ data: song }: { data: ISong }) {
  const theme = useTheme()
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
      <div className="mb-8 mt-4 flex items-center gap-3">
        <div className="flex-grow">
          <h2 className={pageTitleStyles}>{song.title}</h2>
          <p className={classNames(ellipsisTextStyles, 'text-lg')}>
            {song.authors}
          </p>
        </div>
        {isAdmin && (
          <Button
            className="h-toolbar"
            onClick={() => setShowEventsDialog(true)}
          >
            Add to event
          </Button>
        )}
        <div className="flex items-center gap-3">
          <KeySwitcher
            transposeKey={transposeKey}
            setTransposeKey={setTransposeKey}
            onResetTranspose={handleResetTranspose}
            onToggleChords={handleToggleChords}
            showChords={showChords}
          />
          {isAdmin && <IconButton edge icon={editIcon} onClick={handleEdit} />}
        </div>
      </div>
      <p className="whitespace-pre pb-16 font-mono text-base">
        {formattedBody}
      </p>
    </>
  )
}

export default withFetch<INoProps, ISong>(params =>
  fetchSong(params.songId as string)
)(Song)
