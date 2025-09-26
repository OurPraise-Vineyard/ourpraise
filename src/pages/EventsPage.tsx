import type { JSX } from 'react'
import { Link, useLoaderData } from 'react-router'

import type { IEventsData } from '~/backend/events'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import type { IEvent } from '~/types/models'

function renderEventItem(event: IEvent): JSX.Element {
  return (
    <Link
      to={`/events/${event.id}`}
      key={event.id}
      className="flex justify-between gap-4 border-b border-gray-300 p-2 text-lg hover:bg-gray-100"
    >
      <p className="overflow-hidden text-ellipsis whitespace-nowrap">
        {event.title}
      </p>
      <p className="min-w-max overflow-hidden text-ellipsis whitespace-nowrap">
        {event.formattedDate}
      </p>
    </Link>
  )
}

export default function EventsPage() {
  const { upcoming, past }: IEventsData = useLoaderData()

  return (
    <Page>
      <MetaTitle title="Events" />
      <div className="flex justify-end">
        <Link to="/events/add" className="btn btn-primary">
          Add new event
        </Link>
      </div>
      <h2 className="text-title border-b border-b-gray-300 py-2 font-bold">
        Upcoming events
      </h2>
      {upcoming.map(renderEventItem)}
      {upcoming.length === 0 && (
        <p className="pb-2 text-lg">No upcoming events</p>
      )}
      <h2 className="text-title mt-5 border-b border-b-gray-300 py-2 font-bold">
        Past events
      </h2>
      {past.map(renderEventItem)}
    </Page>
  )
}
