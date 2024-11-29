import {
  ellipsisTextStyles,
  pageTitleStyles,
  toolbarStyles
} from '@common-styles'
import classNames from 'classnames'
import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'

import Button from '@components/Button'
import ContextMenu from '@components/ContextMenu'
import EventSongForm from '@components/EventSongForm'
import IconButton from '@components/IconButton'
import withFetch, { IWithFetchProps } from '@components/withFetch'

import downloadIcon from '@assets/download.svg'
import editIcon from '@assets/edit.svg'
import moreIcon from '@assets/more-vertical.svg'
import {
  fetchEvent,
  moveEventSong,
  removeEventSong,
  saveEventSong
} from '@backend/events'
import useAuth from '@hooks/useAuth'
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
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

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
      <div className={toolbarStyles}>
        <h2 className={pageTitleStyles}>{event.title}</h2>
        <span className="flex-grow-0 whitespace-nowrap rounded-md bg-gray-200 px-2 py-1 text-base">
          {eventDate}
        </span>
        {isAdmin && (
          <IconButton
            icon={editIcon}
            onClick={() => navigate('edit')}
            className="flex-shrink-0"
          />
        )}
        <IconButton
          icon={downloadIcon}
          onClick={() => navigate('print')}
          className="flex-shrink-0"
        />
      </div>
      {!!event.comment && (
        <p className="mt-2 whitespace-pre text-lg">{event.comment}</p>
      )}
      {event.songs.map(song => (
        <div className="my-8 border-b border-b-gray-300 pb-8" key={song.id}>
          <div className="flex w-full items-center gap-2">
            <div className="w-0 flex-grow">
              <Link
                className={classNames(ellipsisTextStyles, 'text-lg')}
                to={`/songs/${song.id}`}
              >
                {song.title}
              </Link>
              <p
                className={classNames(
                  ellipsisTextStyles,
                  'text-lg text-gray-400'
                )}
              >
                {song.authors}
              </p>
            </div>
            {song.formattedKey && (
              <div className="rounded-3xl bg-gray-100 px-3 py-2">
                {song.formattedKey}
              </div>
            )}
            {isAdmin && (
              <IconButton icon={moreIcon} onClick={handleOpenMenu(song)} />
            )}
          </div>
          {song.comment && (
            <p className="mt-2 whitespace-pre text-base">{song.comment}</p>
          )}
        </div>
      ))}
      {event.songs.length === 0 && (
        <div className="mx-auto mt-8 flex flex-col items-center">
          <p className="text-lg">
            No songs added yet. Click below to add some.
          </p>
          <Button type="link" to="/songs" variant="primary">
            Add songs
          </Button>
        </div>
      )}
    </div>
  )
}

export default withFetch<INoProps, IEvent>(params =>
  fetchEvent(params.eventId as string)
)(EventPage)
