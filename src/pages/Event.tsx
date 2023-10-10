import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import downloadIcon from '@assets/download.svg'
import editIcon from '@assets/edit.svg'
import { fetchEvent, saveEventSong } from '@backend/events'
import ContextMenu from '@components/ContextMenu'
import Comment from '@components/EventComment'
import EventSongForm from '@components/EventSongForm'
import IconButton from '@components/IconButton'
import SongListItem from '@components/SongListItem'
import SongsOverview from '@components/SongsBulletList'
import Tag from '@components/Tag'
import Toolbar from '@components/Toolbar'
import Title from '@components/text/Title'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import useContextMenuState from '@hooks/useContextMenuState'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useErrors from '@hooks/useErrors'
import { formatDate } from '@utils/date'

function EventPage({ data: event, onTriggerFetch }: IWithFetchProps<IEvent>) {
  useDocumentTitle(event.title)
  const navigate = useNavigate()
  const eventDate = useMemo(() => formatDate(event.date), [event.date])
  const contextMenu = useContextMenuState()
  const [selectedSong, setSelectedSong] = useState<IEventSong | null>(null)
  const [editSong, setEditSong] = useState<boolean>(false)
  const [savingSong, setSavingSong] = useState<boolean>(false)
  const { pushError } = useErrors()

  async function handleSaveEventSong(form: IEventSongForm) {
    try {
      setSavingSong(true)
      await saveEventSong(event.id, form)
      setEditSong(false)
      onTriggerFetch()
    } catch (err) {
      pushError(err)
    } finally {
      setSavingSong(false)
    }
  }

  const handleOpenMenu =
    (song: IEventSong) => (e: React.MouseEvent<HTMLButtonElement>) => {
      setSelectedSong(song)
      contextMenu.onOpen(e)
    }

  const handleRemoveSong = useCallback(() => {
    console.log(`remove song: ${selectedSong}`)
  }, [selectedSong])

  const handleEditSong = useCallback(() => {
    setEditSong(true)
    contextMenu.onClose()
  }, [contextMenu])

  const handleMoveSongUp = useCallback(() => {
    console.log(`move song up: ${selectedSong}`)
  }, [selectedSong])

  const handleMoveSongDown = useCallback(() => {
    console.log(`move song down: ${selectedSong}`)
  }, [selectedSong])

  const contextMenuItems = useMemo(
    () => [
      {
        label: 'Move up',
        onClick: handleMoveSongUp
      },
      {
        label: 'Move down',
        onClick: handleMoveSongDown
      },
      {
        label: 'Edit options',
        onClick: handleEditSong
      },
      {
        label: 'Remove song',
        onClick: handleRemoveSong
      }
    ],
    [handleEditSong, handleRemoveSong, handleMoveSongUp, handleMoveSongDown]
  )

  return (
    <div>
      {contextMenu.show && (
        <ContextMenu
          items={contextMenuItems}
          top={contextMenu.top}
          left={contextMenu.left}
          onClose={contextMenu.onClose}
        />
      )}
      {selectedSong && (
        <EventSongForm
          eventSong={selectedSong}
          onClose={() => setEditSong(false)}
          show={editSong}
          onSubmit={handleSaveEventSong}
          saving={savingSong}
        />
      )}
      <Toolbar>
        <Title>{event.title}</Title>
        <Tag>{eventDate}</Tag>
        <IconButton icon={editIcon} onClick={() => navigate('edit')} />
        <IconButton icon={downloadIcon} onClick={() => window.print()} />
      </Toolbar>
      {!!event.comment && <Comment>{event.comment}</Comment>}
      <SongsOverview songs={event.songs} />
      {event.songs.map((song, i) => (
        <SongListItem
          key={song.id}
          title={song.title || ''}
          authors={song.authors || ''}
          body={song.body}
          formattedKey={song.formattedKey}
          comment={song.comment}
          onOpenMenu={handleOpenMenu(song)}
        />
      ))}
    </div>
  )
}

export default withFetch<INoProps, IEvent>(params =>
  fetchEvent(params.eventId as string)
)(EventPage)
