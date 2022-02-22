import { getRecentEvents } from 'api/events'
import React, { useEffect, useState } from 'react'
import ContentTable from 'Shared/Table'
import Toolbar from 'Events/Toolbar'

function mapDate (date) {
  return new Date(date).toString()
}

function mapEvent (data) {
  return {
    primary: data.title,
    secondary: mapDate(data.date),
    url: `/events/${data.id || data.objectID}`
  }
}

export default function Events () {
  const [events, setEvents] = useState([])

  useEffect(() => {
    getRecentEvents()
      .then(events => setEvents(events.map(mapEvent)))
  }, [])

  return (
    <div>
      <Toolbar />
      <ContentTable
        items={events}
        title={'Recent events'}
      />
    </div>
  )
}
