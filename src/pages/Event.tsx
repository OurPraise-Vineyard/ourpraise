import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import downloadIcon from '@assets/download.svg'
import editIcon from '@assets/edit.svg'
import { fetchEvent } from '@backend/events'
import ContextMenu from '@components/ContextMenu'
import Comment from '@components/EventComment'
import IconButton from '@components/IconButton'
import SongListItem from '@components/SongListItem'
import SongsOverview from '@components/SongsBulletList'
import Tag from '@components/Tag'
import Toolbar from '@components/Toolbar'
import Title from '@components/text/Title'
import withFetch from '@components/withFetch'
import useContextMenuState from '@hooks/useContextMenuState'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { formatDate } from '@utils/date'

function EventPage({ data: event }: { data: IEvent }) {
  useDocumentTitle(event.title)
  const { eventId } = useParams()
  const navigate = useNavigate()
  const eventDate = useMemo(() => formatDate(event.date), [event.date])
  const contextMenu = useContextMenuState()
  const [selectedSong, setSelectedSong] = useState<IDocId>('')

  const handleDownload = () => {
    window.print()
  }

  function handleEdit() {
    navigate(`/events/${eventId}/edit`)
  }

  const handleOpenMenu =
    (id: IDocId) => (e: React.MouseEvent<HTMLButtonElement>) => {
      setSelectedSong(id)
      contextMenu.onOpen(e)
    }

  const handleRemoveSong = useCallback(() => {
    console.log(`remove song: ${selectedSong}`)
  }, [selectedSong])

  const handleEditSong = useCallback(() => {
    console.log(`edit song: ${selectedSong}`)
  }, [selectedSong])

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
      <Toolbar>
        <Title>{event.title}</Title>
        <Tag>{eventDate}</Tag>
        <IconButton icon={editIcon} onClick={handleEdit} />
        <IconButton icon={downloadIcon} onClick={handleDownload} />
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
          onOpenMenu={handleOpenMenu(song.id)}
        />
      ))}
    </div>
  )
}

export default withFetch<INoProps, IEvent>(params =>
  fetchEvent(params.eventId as string)
)(EventPage)
