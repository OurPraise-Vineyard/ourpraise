import { pageTitle } from '@common-styles'
import classNames from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'

import Button from '@components/Button'
import { SelectField } from '@components/FormFields'
import withFetch from '@components/withFetch'

import { IEventsData, fetchEvents } from '@backend/events'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { locations, useSavedLocation } from '@hooks/useSavedLocation'
import { formatDate } from '@utils/date'

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
        {formatDate(event.date)}
      </p>
    </Link>
  )
}

function Events({ data: { upcoming, past } }: { data: IEventsData }) {
  useDocumentTitle('Events')
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [location, setLocation] = useSavedLocation()

  const upcomingFiltered = upcoming.filter(e =>
    e.location ? e.location === location : location === locations[0].value
  )
  const pastFiltered = past.filter(e =>
    e.location ? e.location === location : location === locations[0].value
  )

  return (
    <div>
      <div className="flex items-center justify-end gap-4 border-b border-b-gray-300 py-2">
        <h2 className={classNames(pageTitle, 'flex-grow')}>Upcoming events</h2>
        <SelectField
          value={location}
          onChange={setLocation}
          options={locations}
          className="h-toolbar flex items-center"
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
          pageTitle,
          'mt-5 border-b border-b-gray-300 py-2'
        )}
      >
        Past events
      </h2>
      {pastFiltered.map(renderEventItem)}
    </div>
  )
}

export default withFetch<INoProps, IEventsData>(fetchEvents)(Events)
