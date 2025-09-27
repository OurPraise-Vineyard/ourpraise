import classNames from 'classnames'
import { type JSX, useState } from 'react'
import { Link, useLoaderData } from 'react-router'

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
  const events: IEvent[] = useLoaderData()

  return (
    <Page>
      <MetaTitle title="Events" />

      <div className="flex w-full flex-row items-center gap-2">
        <div className="grow" />

        <div className="flex justify-end">
          <Link to="/events/add" className="btn btn-primary">
            Create event
          </Link>
        </div>
      </div>

      <ul className="list bg-base-100 rounded-box mt-4 shadow-md">
        {events.map(renderEventItem)}
        {events.length === 0 && <p className="">No events</p>}
      </ul>
    </Page>
  )
}
