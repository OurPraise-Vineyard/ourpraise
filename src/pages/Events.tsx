import React from 'react'

import { IEventsData, fetchEvents } from '@backend/events'
import CompactListItem from '@components/CompactListItem'
import Toolbar from '@components/Toolbar'
import ToolbarLinkButton from '@components/ToolbarLinkButton'
import Paragraph from '@components/text/Paragraph'
import Title from '@components/text/Title'
import withFetch from '@components/withFetch'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { formatDate } from '@utils/date'

function renderEventItem(event: IEvent): JSX.Element {
  return (
    <CompactListItem
      to={`/events/${event.id}`}
      primary={event.title}
      secondary={formatDate(event.date)}
    />
  )
}

function EventOverview({ data: { upcoming, past } }: { data: IEventsData }) {
  useDocumentTitle('Events')

  return (
    <div>
      <Toolbar>
        <Title>Upcoming events</Title>
        <ToolbarLinkButton to="/events/add">Add new event</ToolbarLinkButton>
      </Toolbar>
      {upcoming.map(renderEventItem)}
      {upcoming.length === 0 && <Paragraph>No upcoming events</Paragraph>}
      <Toolbar extraSpacingTop>
        <Title>Past events</Title>
      </Toolbar>
      {past.map(renderEventItem)}
    </div>
  )
}

export default withFetch<IEventsData>(fetchEvents)(EventOverview)
