import { useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router'

import moreIcon from '~/assets/more-vertical.svg'
import {
  deleteEvent,
  moveEventSong,
  removeEventSong,
  saveEventSong
} from '~/backend/events'
import Button from '~/components/Button'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import IconButton from '~/components/IconButton'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import { usePopUpMenu } from '~/components/PopUpMenu'
import EventSongForm from '~/pages/Event/EventSongForm'
import type { IEventSongForm } from '~/types/forms'
import type { IEvent, IEventSong } from '~/types/models'
import { formatLink } from '~/utils/link-formatter'

export default function EventPage() {
  const event: IEvent = useLoaderData()
  const navigate = useNavigate()
  const [selectedSong, setSelectedSong] = useState<IEventSong | null>(null)
  const [editSong, setEditSong] = useState<boolean>(false)
  const [savingSong, setSavingSong] = useState<boolean>(false)
  const menu = usePopUpMenu()
  const errors = useErrorPopUp()

  function triggerReload() {
    // This will trigger a reload of the page
    navigate(`/events/${event.id}`)
  }

  async function handleSaveEventSong(form: IEventSongForm) {
    try {
      setSavingSong(true)
      await saveEventSong(event.id, form)
      setEditSong(false)
      triggerReload()
    } catch (err: any) {
      errors.show(err.message)
    } finally {
      setSavingSong(false)
    }
  }

  const handleOpenEventMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    menu.open(e, () => [
      {
        label: 'Edit event',
        onClick() {
          navigate(`/events/${event.id}/edit`)
        }
      },
      {
        label: 'Delete event',
        danger: true,
        async onClick() {
          if (window.confirm('Delete this event?')) {
            try {
              await deleteEvent(event.id)
              navigate('/events')
            } catch (err: any) {
              errors.show(err.message)
            }
          }
        }
      }
    ])
  }

  const handleOpenSongMenu =
    (selectedSong: IEventSong) => (e: React.MouseEvent<HTMLButtonElement>) => {
      setSelectedSong(selectedSong)
      menu.open(e, () => [
        {
          label: 'Move up',
          async onClick() {
            if (selectedSong) {
              try {
                await moveEventSong(event.id, selectedSong.id, -1)
                triggerReload()
              } catch (err: any) {
                errors.show(err.message)
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
                triggerReload()
              } catch (err: any) {
                errors.show(err.message)
              }
            }
          }
        },
        {
          label: 'Edit options',
          onClick() {
            setEditSong(true)
          }
        },
        {
          label: 'Remove song',
          danger: true,
          async onClick() {
            if (selectedSong) {
              if (
                window.confirm(
                  `Remove "${selectedSong.title}" from this event?`
                )
              ) {
                try {
                  await removeEventSong(event.id, selectedSong.id)
                  triggerReload()
                } catch (err: any) {
                  errors.show(err.message)
                }
              }
            }
          }
        }
      ])
    }

  return (
    <Page>
      <MetaTitle title={event.title} />
      {selectedSong && (
        <EventSongForm
          eventSong={selectedSong}
          onClose={() => setEditSong(false)}
          show={editSong}
          onSubmit={handleSaveEventSong}
          saving={savingSong}
        />
      )}
      <div className="flex items-start gap-4 border-b border-b-gray-300 py-4">
        <div className="grow">
          <h2 className="text-title font-bold">{event.title}</h2>
          <span className="text-lg">{event.formattedDate}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            type="link"
            to={`/events/${event.id}/print`}
            variant="primary"
            disabled={event.songs.length === 0}
          >
            Print
          </Button>
          <IconButton icon={moreIcon} onClick={handleOpenEventMenu} />
        </div>
      </div>
      {!!event.comment && (
        <>
          <p className="mb-6 py-2 text-lg whitespace-pre">{event.comment}</p>
          <p className="mt-4 border-b border-b-gray-300 pb-2 text-lg font-bold">
            Songs:
          </p>
        </>
      )}
      <div>
        {event.songs.map(song => (
          <div className="border-b border-b-gray-300 py-8" key={song.id}>
            <div className="flex w-full items-center gap-2">
              <div className="w-0 grow">
                <Link
                  className="overflow-hidden text-lg text-ellipsis whitespace-nowrap"
                  to={`/songs/${song.id}`}
                >
                  {song.title}
                </Link>
                <p className="overflow-hidden text-lg text-ellipsis whitespace-nowrap text-gray-400">
                  {song.authors}
                </p>
              </div>
              {song.formattedKey && (
                <div className="rounded-full bg-gray-100 px-3 py-2">
                  {song.formattedKey}
                </div>
              )}
              <IconButton icon={moreIcon} onClick={handleOpenSongMenu(song)} />
            </div>
            {song.comment && (
              <p className="mt-2 text-base whitespace-pre">{song.comment}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 mb-8 flex flex-col items-center gap-4">
        {event.songs.length === 0 && (
          <p className="text-lg">
            {event.isUpcoming ? 'No songs added yet.' : 'Event has no songs.'}
          </p>
        )}
        {event.isUpcoming && (
          <Button
            type="link"
            to={formatLink('/songs', {
              eventId: event.id,
              eventTitle: event.title
            })}
            variant={event.songs.length === 0 ? 'primary' : 'default'}
          >
            {event.songs.length === 0
              ? 'Add songs to this event'
              : 'Add more songs to this event'}
          </Button>
        )}
      </div>
    </Page>
  )
}
