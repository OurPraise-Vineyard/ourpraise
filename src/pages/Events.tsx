import React from 'react'

import CompactListItem from '@components/CompactListItem'
import withFetch from '@components/withFetch'

import Toolbar from '@blocks/Toolbar'
import ToolbarLinkButton from '@blocks/ToolbarLinkButton'
import Paragraph from '@blocks/text/Paragraph'
import Title from '@blocks/text/Title'

import { IEventsData, fetchEvents } from '@backend/events'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { formatDate } from '@utils/date'

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

  return (
    <div>
      <Toolbar>
        <Title>Upcoming events</Title>
        {isAdmin && (
          <ToolbarLinkButton to="/events/add">Add new event</ToolbarLinkButton>
        )}
      </Toolbar>
      {upcoming.map(renderEventItem)}
      {upcoming.length === 0 && <Paragraph>No upcoming events</Paragraph>}
      <Toolbar $extraSpacingTop>
        <Title>Past events</Title>
      </Toolbar>
      {past.map(renderEventItem)}
    </div>
  )
}

export default withFetch<INoProps, IEventsData>(fetchEvents)(Events)
