import { useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router'

import editIcon from '~/assets/edit.svg'
import { moveEventSong, removeEventSong, saveEventSong } from '~/backend/events'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import EventSongForm from '~/components/EventSongForm'
import IconButton from '~/components/IconButton'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import { usePopUpMenu } from '~/components/PopUpMenu'
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
          <Link className="btn btn-primary" to={`/events/${event.id}/print`}>
            Print
          </Link>
          <Link className="btn" to={`/events/${event.id}/edit`}>
            <img src={editIcon} className="icon" />
            Edit event
          </Link>
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
              <IconButton icon={editIcon} onClick={handleOpenSongMenu(song)} />
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
          <Link
            className="btn"
            to={formatLink('/songs', {
              eventId: event.id,
              eventTitle: event.title
            })}
            variant={event.songs.length === 0 ? 'primary' : 'default'}
          >
            {event.songs.length === 0
              ? 'Add songs to this event'
              : 'Add more songs to this event'}
          </Link>
        )}
      </div>
    </Page>
  )
}
