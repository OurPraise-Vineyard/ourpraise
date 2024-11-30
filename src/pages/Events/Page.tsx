import classNames from 'classnames'

import { Link, getRouteApi } from '@tanstack/react-router'

import { fetchEvents } from '~/backend/events'
import { IEventsData } from '~/backend/events'
import { pageTitleStyles, toolbarStyles } from '~/common-styles'
import Button from '~/components/Button'
import { SelectField } from '~/components/FormFields'
import Page from '~/components/Page'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import { locations, useSavedLocation } from '~/hooks/useSavedLocation'
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
  const [location, setLocation] = useSavedLocation()

  const upcomingFiltered = upcoming.filter(e =>
    e.location ? e.location === location : location === locations[0].value
  )
  const pastFiltered = past.filter(e =>
    e.location ? e.location === location : location === locations[0].value
  )

  return (
    <Page>
      <div className={toolbarStyles}>
        <h2 className={classNames(pageTitleStyles, 'flex-grow')}>
          Upcoming events
        </h2>
        <SelectField
          value={location}
          onChange={setLocation}
          options={locations}
          className="flex h-toolbar items-center"
        />
        <Button
          type="link"
          to="/events/add"
          className="h-toolbar"
          variant="primary"
        >
          Add new event
        </Button>
      </div>
      {upcomingFiltered.map(renderEventItem)}
      {upcomingFiltered.length === 0 && (
        <p className="pb-2 text-lg">No upcoming events</p>
      )}
      <h2
        className={classNames(
          pageTitleStyles,
          'mt-5 border-b border-b-gray-300 py-2'
        )}
      >
        Past events
      </h2>
      {pastFiltered.map(renderEventItem)}
    </Page>
  )
}
