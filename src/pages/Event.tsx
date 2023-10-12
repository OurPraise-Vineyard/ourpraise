import downloadIcon from 'assets/download.svg'
import editIcon from 'assets/edit.svg'
import {
  fetchEvent,
  moveEventSong,
  removeEventSong,
  saveEventSong
} from 'backend/events'
import Block from 'blocks/Block'
import Comment from 'blocks/EventComment'
import EventSongsBulletList from 'blocks/EventSongsBulletList'
import IconButton from 'blocks/IconButton'
import Link from 'blocks/Link'
import Tag from 'blocks/Tag'
import Toolbar from 'blocks/Toolbar'
import Paragraph from 'blocks/text/Paragraph'
import Title from 'blocks/text/Title'
import ContextMenu from 'components/ContextMenu'
import EventSongForm from 'components/EventSongForm'
import SongListItem from 'components/SongListItem'
import withFetch, { IWithFetchProps } from 'components/withFetch'
import useContextMenuState from 'hooks/useContextMenuState'
import { useDocumentTitle } from 'hooks/useDocumentTitle'
import useErrors from 'hooks/useErrors'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from 'utils/date'

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

  const contextMenuItems = useMemo(
    () => [
      {
        label: 'Move up',
        async onClick() {
          if (selectedSong) {
            try {
              await moveEventSong(event.id, selectedSong.id, -1)
              onTriggerFetch()
            } catch (err) {
              pushError(err)
            } finally {
              contextMenu.onClose()
            }
          }
        }
      },
      {
        label: 'Move down',
        async onClick() {
          if (selectedSong) {
            try {
              await moveEventSong(event.id, selectedSong.id, 1)
              onTriggerFetch()
            } catch (err) {
              pushError(err)
            } finally {
              contextMenu.onClose()
            }
          }
        }
      },
      {
        label: 'Edit options',
        onClick() {
          setEditSong(true)
          contextMenu.onClose()
        }
      },
      {
        label: 'Remove song',
        async onClick() {
          if (selectedSong) {
            if (
              window.confirm(`Remove "${selectedSong.title}" from this event?`)
            ) {
              contextMenu.onClose()
              try {
                await removeEventSong(event.id, selectedSong.id)
                onTriggerFetch()
              } catch (err) {
                pushError(err)
              } finally {
                contextMenu.onClose()
              }
            }
          }
        }
      }
    ],
    [contextMenu, selectedSong, event.id, pushError, onTriggerFetch]
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
      <EventSongsBulletList>
        {event.songs.map(song => (
          <li key={song.id}>{song.title}</li>
        ))}
      </EventSongsBulletList>
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
      {event.songs.length === 0 && (
        <Block
          print="hide"
          flex="column"
          align="center"
          margin="32px auto 0"
          width="350px"
        >
          <Paragraph>No songs added yet. Click below to add some.</Paragraph>
          <Link to="/songs" color="ctaPrimary">
            Add songs
          </Link>
        </Block>
      )}
    </div>
  )
}

export default withFetch<INoProps, IEvent>(params =>
  fetchEvent(params.eventId as string)
)(EventPage)
