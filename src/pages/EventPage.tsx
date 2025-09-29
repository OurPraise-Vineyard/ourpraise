import { useMemo } from 'react'
import { Link, useLoaderData } from 'react-router'

import editIcon from '~/assets/edit.svg'
import linkIcon from '~/assets/external-link.svg'
import commentIcon from '~/assets/message-square.svg'
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
            <Link to="/events">Events</Link>
          </li>
          <li>{event.title}</li>
        </ul>
      </div>

      <div className="my-4 flex items-start gap-4">
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
        <div className="my-6 flex gap-6 rounded-sm px-6 py-4 shadow-sm">
          <img src={commentIcon} className="icon my-1" />
          <p className="whitespace-pre">{event.comment}</p>
        </div>
      )}

      <div className="my-6">
        {event.songs?.length === 0 && (
          <p>
            {isUpcoming
              ? 'No songs added yet. Edit event to add some.'
              : 'Event has no songs.'}
          </p>
        )}
      </div>

      <ul className="list my-6 rounded-sm p-2 shadow-sm">
        <li className="p-4 pb-2 text-xs tracking-wide opacity-60">Songs</li>

        {event.songs?.map(song => (
          <li key={song.id} className="list-row hover:bg-base-300 w-full">
            <div>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                {song.title || (
                  <span className="text-red-500 italic">Missing title</span>
                )}
              </p>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                {song.authors || (
                  <span className="text-red-500 italic">Missing authors</span>
                )}
              </p>
            </div>
            <div className="flex flex-row items-center justify-end gap-4">
              <div className="badge badge-soft badge-accent text-nowrap break-keep">
                {formatKey(song.key)}
              </div>
              <Link
                to={`/songs/${song.id}`}
                target="_blank"
                className="btn btn-ghost btn-circle"
              >
                <img src={linkIcon} className="icon" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Page>
  )
}
