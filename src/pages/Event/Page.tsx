import { useMemo, useState } from 'react'
import * as React from 'react'

import { Link, getRouteApi } from '@tanstack/react-router'

import downloadIcon from '~/assets/download.svg'
import editIcon from '~/assets/edit.svg'
import moreIcon from '~/assets/more-vertical.svg'
import {
  fetchEvent,
  moveEventSong,
  removeEventSong,
  saveEventSong
} from '~/backend/events'
import Button from '~/components/Button'
import ContextMenu from '~/components/ContextMenu'
import EventSongForm from '~/components/EventSongForm'
import IconButton from '~/components/IconButton'
import Page from '~/components/Page'
import useContextMenuState from '~/hooks/useContextMenuState'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import { RouteLoader, RoutePath } from '~/router'

export const loader: RouteLoader = ({ params }) => fetchEvent(params.id)

export default function EventPage({ routePath }: { routePath: RoutePath }) {
  const { useLoaderData, useNavigate } = getRouteApi(routePath)
  const event: IEvent = useLoaderData()
  useDocumentTitle(event.title)
  const navigate = useNavigate()
  const contextMenu = useContextMenuState()
  const [selectedSong, setSelectedSong] = useState<IEventSong | null>(null)
  const [editSong, setEditSong] = useState<boolean>(false)
  const [savingSong, setSavingSong] = useState<boolean>(false)

  function triggerReload() {
    // This will trigger a reload of the page
    navigate({
      to: '/events/$id',
      params: { id: event.id }
    })
  }

  async function handleSaveEventSong(form: IEventSongForm) {
    try {
      setSavingSong(true)
      await saveEventSong(event.id, form)
      setEditSong(false)
      triggerReload()
    } catch (err: any) {
      console.error(err.message)
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
              triggerReload()
            } catch (err: any) {
              console.error(err.message)
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
              triggerReload()
            } catch (err: any) {
              console.error(err.message)
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
                triggerReload()
              } catch (err: any) {
                console.error(err.message)
              } finally {
                contextMenu.onClose()
              }
            }
          }
        }
      }
    ],
    [contextMenu, selectedSong, event.id, console.error, triggerReload]
  )

  return (
    <Page>
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
      <div className="flex items-center gap-4 border-b border-b-gray-300 py-4">
        <h2 className="text-title flex-grow overflow-x-hidden text-ellipsis whitespace-nowrap font-bold">
          {event.title}
        </h2>
        <span className="flex-grow-0 whitespace-nowrap rounded-md bg-gray-200 px-2 py-1 text-base">
          {event.formattedDate}
        </span>
        <IconButton
          icon={editIcon}
          onClick={() =>
            navigate({
              to: '/events/$id/edit',
              params: { id: event.id }
            })
          }
          className="flex-shrink-0"
        />
        <IconButton
          icon={downloadIcon}
          onClick={() =>
            navigate({
              to: '/events/$id/print',
              params: { id: event.id }
            })
          }
          className="flex-shrink-0"
        />
      </div>
      {!!event.comment && (
        <>
          <p className="mb-6 whitespace-pre py-2 text-lg">{event.comment}</p>
          <p className="mt-4 border-b border-b-gray-300 pb-2 text-lg font-bold">
            Songs:
          </p>
        </>
      )}
      <div>
        {event.songs.map(song => (
          <div className="border-b border-b-gray-300 py-8" key={song.id}>
            <div className="flex w-full items-center gap-2">
              <div className="w-0 flex-grow">
                <Link
                  className="overflow-hidden text-ellipsis whitespace-nowrap text-lg"
                  to="/songs/$id"
                  params={{ id: song.id }}
                >
                  {song.title}
                </Link>
                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-lg text-gray-400">
                  {song.authors}
                </p>
              </div>
              {song.formattedKey && (
                <div className="rounded-3xl bg-gray-100 px-3 py-2">
                  {song.formattedKey}
                </div>
              )}
              <IconButton icon={moreIcon} onClick={handleOpenMenu(song)} />
            </div>
            {song.comment && (
              <p className="mt-2 whitespace-pre text-base">{song.comment}</p>
            )}
          </div>
        ))}
      </div>
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
    </Page>
  )
}
