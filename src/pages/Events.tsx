import React from 'react'

import { IEventsData, fetchEvents } from '@backend/events'
import ContentTable from '@components/ContentTable'
import Toolbar from '@components/Toolbar'
import ToolbarButton from '@components/ToolbarButton'
import withFetch from '@components/withFetch'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { formatDate } from '@utils/date'

function mapEvent(data) {
  return {
    primary: data.title,
    secondary: formatDate(data.date),
    url: `/events/${data.id || data.objectID}`
  }
}

function EventOverview({ data: { upcoming, past } }: { data: IEventsData }) {
  useDocumentTitle('Events')

  return (
    <div>
      <Toolbar>
        <ToolbarButton to="/events/add">Add new event</ToolbarButton>
      </Toolbar>
      {upcoming.length > 0 && (
        <ContentTable
          items={upcoming}
          title={'Upcoming events'}
          mapper={mapEvent}
        />
      )}
      <ContentTable items={past} title={'Past events'} mapper={mapEvent} />
    </div>
  )
}

export default withFetch<IEventsData>(fetchEvents)(EventOverview)
