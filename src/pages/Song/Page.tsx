import { useState } from 'react'

import { getRouteApi } from '@tanstack/react-router'

import editIcon from '~/assets/edit.svg'
import { getAuthState } from '~/backend/auth'
import { fetchSong } from '~/backend/songs'
import AddToEvent from '~/components/AddToEvent'
import Button from '~/components/Button'
import IconButton from '~/components/IconButton'
import KeySwitcher from '~/components/KeySwitcher'
import Page from '~/components/Page'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import useFormattedSongBody from '~/hooks/useFormattedSongBody'
import { RoutePath } from '~/router'

export const loader = ({ params }) => fetchSong(params.id)

export default function SongPage({ routePath }: { routePath: RoutePath }) {
  const { useLoaderData, useNavigate } = getRouteApi(routePath)
  const song: ISong = useLoaderData()
  const [transposeKey, setTransposeKey] = useState<IKey>(song.key)
  const [showChords, setShowChords] = useState(true)
  const [showEventsDialog, setShowEventsDialog] = useState(false)
  const navigate = useNavigate()
  const { user } = getAuthState()
  const formattedBody = useFormattedSongBody(song, showChords, transposeKey)
  useDocumentTitle(song.title)

  const isAdmin = user?.role === 'admin'

  function handleEdit() {
    navigate({
      to: '/songs/$id/edit',
      params: { id: song.id }
    })
  }

  const handleResetTranspose = () => {
    setTransposeKey(song.key)
  }

  function handleToggleChords() {
    setShowChords(!showChords)
  }

  return (
    <Page>
      {isAdmin && (
        <AddToEvent
          show={showEventsDialog}
          onClose={() => setShowEventsDialog(false)}
          songId={song.id}
          songKey={transposeKey}
        />
      )}
      <div className="mb-8 mt-4 flex items-center gap-3">
        <div className="w-1/2">
          <h2 className="text-title font-bold">{song.title}</h2>
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-lg">
            {song.authors}
          </p>
        </div>
        <span className="flex-grow" />
        {isAdmin && (
          <Button
            className="h-toolbar"
            onClick={() => setShowEventsDialog(true)}
          >
            Add to event
          </Button>
        )}
        <div className="flex w-min flex-shrink-0 items-center gap-3">
          <KeySwitcher
            transposeKey={transposeKey}
            setTransposeKey={setTransposeKey}
            onResetTranspose={handleResetTranspose}
            onToggleChords={handleToggleChords}
            showChords={showChords}
          />
          {isAdmin && (
            <IconButton
              icon={editIcon}
              onClick={handleEdit}
              className="flex-shrink-0"
            />
          )}
        </div>
      </div>
      <p className="whitespace-pre pb-16 font-mono text-base">
        {formattedBody}
      </p>
    </Page>
  )
}
