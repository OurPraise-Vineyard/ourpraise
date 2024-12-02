import { Link, getRouteApi } from '@tanstack/react-router'

import { fetchEvents } from '~/backend/events'
import { IEventsData } from '~/backend/events'
import Button from '~/components/Button'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import { RoutePath } from '~/router'
import { IEvent } from '~/types/models'
import { formatDate } from '~/utils/date'

function renderEventItem(event: IEvent): JSX.Element {
  return (
    <Link
      to="/events/$id"
      params={{ id: event.id }}
      key={event.id}
      className="flex justify-between gap-4 border-b border-gray-300 p-2 text-lg hover:bg-gray-100"
    >
      <p className="overflow-hidden text-ellipsis whitespace-nowrap">
        {event.title}
      </p>
      <p className="min-w-max overflow-hidden text-ellipsis whitespace-nowrap">
        {formatDate(event.date)}
      </p>
    </Link>
  )
}

export const loader = () => fetchEvents()

export default function EventsPage({ routePath }: { routePath: RoutePath }) {
  const { upcoming, past }: IEventsData = getRouteApi(routePath).useLoaderData()

  return (
    <Page>
      <MetaTitle title="Events" />
      <div className="flex items-center justify-end gap-4">
        <Button
          type="link"
          to="/events/add"
          className="h-toolbar"
          variant="primary"
        >
          Add new event
        </Button>
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
