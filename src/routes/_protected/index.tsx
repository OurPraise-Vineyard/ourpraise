import { pageTitleStyles, toolbarStyles } from '@common-styles'
import classNames from 'classnames'

import Button from '@components/Button'
import { SelectField } from '@components/FormFields'
import Page from '@components/Page'

import { getAuthState, requireLoggedIn } from '@backend/auth'
import { fetchEvents } from '@backend/events'
import { IEventsData } from '@backend/events'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { locations, useSavedLocation } from '@hooks/useSavedLocation'
import { createFileRoute } from '@tanstack/react-router'
import { Link, getRouteApi } from '@tanstack/react-router'
import { formatDate } from '@utils/date'

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

function Events() {
  const { upcoming, past }: IEventsData =
    getRouteApi('/_protected/').useLoaderData()
  useDocumentTitle('Events')
  const { user } = getAuthState()
  const isAdmin = user?.role === 'admin'
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
        {isAdmin && (
          <Button
            type="link"
            to="/events/add"
            className="h-toolbar"
            variant="primary"
          >
            Add new event
          </Button>
        )}
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

export const Route = createFileRoute('/_protected/')({
  beforeLoad: requireLoggedIn,
  loader: () => fetchEvents(),
  component: Events
})
