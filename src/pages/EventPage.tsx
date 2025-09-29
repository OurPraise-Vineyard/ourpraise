import { useMemo } from 'react'
import { Link, NavLink, useLoaderData } from 'react-router'

import editIcon from '~/assets/edit.svg'
import musicIcon from '~/assets/music.svg'
import Page from '~/components/Page'
import useDocumentTitle from '~/hooks/useDocumentTitle'
import type { IEvent } from '~/types'
import { formatKey } from '~/utils/chords'
import { formatDate, getTime, todayTime } from '~/utils/date'

export default function EventPage() {
  const event: IEvent = useLoaderData()
  useDocumentTitle(event.title)
  const formattedDate = useMemo(() => formatDate(event.date), [event.date])
  const isUpcoming = useMemo(
    () => getTime(event.date) >= todayTime(),
    [event.date]
  )

  return (
    <Page>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          <li>{event.title}</li>
        </ul>
      </div>

      <div className="flex items-start gap-4 border-b border-b-gray-300 py-4">
        <div className="grow">
          <h2 className="text-lg font-bold">{event.title}</h2>
          <p>{formattedDate}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link className="btn btn-primary" to={`/events/${event.id}/print`}>
            <img src={musicIcon} className="icon" />
            Play set/Print
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
        {event.songs?.map(song => (
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
              <div className="rounded-full bg-gray-100 px-3 py-2">
                {formatKey(song.transposeKey)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="my-8">
        {event.songs?.length === 0 && (
          <p>
            {isUpcoming
              ? 'No songs added yet. Edit event to add some.'
              : 'Event has no songs.'}
          </p>
        )}
      </div>
    </Page>
  )
}
