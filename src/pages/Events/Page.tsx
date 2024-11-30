import { Link, getRouteApi } from '@tanstack/react-router'

import { fetchEvents } from '~/backend/events'
import { IEventsData } from '~/backend/events'
import Button from '~/components/Button'
import Page from '~/components/Page'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import { RoutePath } from '~/router'
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
  useDocumentTitle('Events')

  return (
    <Page>
      <div className="flex items-center gap-4 border-b border-b-gray-300 py-4">
        <h2 className="text-title flex-grow font-bold">Upcoming events</h2>
        <Button
          type="link"
          to="/events/add"
          className="h-toolbar"
          variant="primary"
        >
          Add new event
        </Button>
      </div>
      {upcoming.map(renderEventItem)}
      {upcoming.length === 0 && (
        <p className="pb-2 text-lg">No upcoming events</p>
      )}
      <h2 className="text-title mt-5 flex-grow border-b border-b-gray-300 py-2 font-bold">
        Past events
      </h2>
      {past.map(renderEventItem)}
    </Page>
  )
}
