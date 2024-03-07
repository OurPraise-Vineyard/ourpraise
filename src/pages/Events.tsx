import React, { useState } from 'react'

import CompactListItem from '@components/CompactListItem'
import SelectField from '@components/form/SelectField'
import withFetch from '@components/withFetch'

import Toolbar from '@blocks/Toolbar'
import ToolbarLinkButton from '@blocks/ToolbarLinkButton'
import Paragraph from '@blocks/text/Paragraph'
import Title from '@blocks/text/Title'

import { IEventsData, fetchEvents } from '@backend/events'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { formatDate } from '@utils/date'
import { useSavedLocation, locations } from '@hooks/useSavedLocation'

function renderEventItem(event: IEvent): JSX.Element {
  return (
    <CompactListItem
      key={event.id}
      to={`/events/${event.id}`}
      primary={event.title}
      secondary={formatDate(event.date)}
    />
  )
}

function Events({ data: { upcoming, past } }: { data: IEventsData }) {
  useDocumentTitle('Events')
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [location, setLocation] = useSavedLocation()

  const upcomingFiltered = upcoming.filter(e => e.location === location)
  const pastFiltered = past.filter(e => e.location === location)

  return (
    <div>
      <Toolbar>
        <Title>Upcoming events</Title>
        <SelectField
          value={location}
          onChange={setLocation}
          options={locations}
        />
        {isAdmin && (
          <ToolbarLinkButton to="/events/add">Add new event</ToolbarLinkButton>
        )}
      </Toolbar>
      {upcomingFiltered.map(renderEventItem)}
      {upcomingFiltered.length === 0 && (
        <Paragraph>No upcoming events</Paragraph>
      )}
      <Toolbar $extraSpacingTop>
        <Title>Past events</Title>
      </Toolbar>
      {pastFiltered.map(renderEventItem)}
    </div>
  )
}

export default withFetch<INoProps, IEventsData>(fetchEvents)(Events)
