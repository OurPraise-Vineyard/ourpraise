import { Link, useLoaderData, useSearchParams } from 'react-router'

import useDocumentTitle from '~/hooks/useDocumentTitle'
import useFilteredItems from '~/hooks/useFilteredItems'
import type { IEvent } from '~/types/models'

export default function EventsPage() {
  useDocumentTitle('Events')
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const events: IEvent[] = useFilteredItems(useLoaderData(), query, [
    'title',
    'formattedDate'
  ])

  return (
    <>
      <ul className="list bg-base-100 rounded-box mt-4 shadow-md">
        {query ? (
          <li className="p-4 pb-2 text-xs tracking-wide opacity-60">
            Search results for "{query}"
          </li>
        ) : (
          <></>
        )}

        {events.map(event => (
          <li key={event.id}>
            <Link
              to={`/events/${event.id}`}
              className="list-row hover:bg-base-200"
            >
              <p className="list-col-grow overflow-hidden text-ellipsis whitespace-nowrap">
                {event.title}
              </p>
              <p>{event.formattedDate}</p>
            </Link>
          </li>
        ))}
        {events.length === 0 && <p className="">No events</p>}
      </ul>
    </>
  )
}
