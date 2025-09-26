import classNames from 'classnames'
import { type JSX, useState } from 'react'
import { Link, useLoaderData } from 'react-router'

import type { IEventsData } from '~/backend/events'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import type { IEvent } from '~/types/models'

function renderEventItem(event: IEvent): JSX.Element {
  return (
    <li>
      <Link
        to={`/events/${event.id}`}
        key={event.id}
        className="list-row hover:bg-base-200"
      >
        <p className="list-col-grow overflow-hidden text-ellipsis whitespace-nowrap">
          {event.title}
        </p>
        <p>{event.formattedDate}</p>
      </Link>
    </li>
  )
}

export default function EventsPage() {
  const events: IEventsData = useLoaderData()
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  return (
    <Page>
      <MetaTitle title="Events" />

      <div className="flex w-full flex-row items-center gap-2">
        <div role="tablist" className="tabs tabs-box">
          <button
            role="tab"
            className={classNames({
              tab: true,
              'tab-active': tab === 'upcoming'
            })}
            onClick={() => setTab('upcoming')}
          >
            Upcoming events
          </button>
          <a
            role="tab"
            className={classNames({
              tab: true,
              'tab-active': tab === 'past'
            })}
            onClick={() => setTab('past')}
          >
            Past events
          </a>
        </div>

        <div className="grow" />

        <div className="flex justify-end">
          <Link to="/events/add" className="btn btn-primary">
            Add new event
          </Link>
        </div>
      </div>

      <ul className="list bg-base-100 rounded-box mt-4 shadow-md">
        {events[tab].map(renderEventItem)}
        {events[tab].length === 0 && (
          <p className="pb-2 text-lg">No {tab} events</p>
        )}
      </ul>
    </Page>
  )
}
