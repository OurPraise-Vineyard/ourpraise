import React, { useEffect } from 'react'
import ContentTable from '@Shared/Table'
import Toolbar from '@Events/Toolbar'
import formatDate from '@date'
import { FetchStatus } from '@slices/utils'
import { useAppDispatch, useAppSelector } from '@hooks'
import { fetchRecentEvents } from '@slices/events'

function mapEvent (data) {
  return {
    primary: data.title,
    secondary: formatDate(data.date),
    url: `/events/${data.id || data.objectID}`
  }
}

export default function Events () {
  const dispatch = useAppDispatch()
  const events = useAppSelector(state => state.events.allEvents)
  const statusAllEvents = useAppSelector(state => state.events.statusAllEvents)

  useEffect(() => {
    if (statusAllEvents !== FetchStatus.loading && statusAllEvents !== FetchStatus.succeeded) {
      dispatch(fetchRecentEvents())
    }
  }, [dispatch, statusAllEvents])

  return (
    <div>
      <Toolbar />
      <ContentTable
        items={events}
        title={'Recent events'}
        mapper={mapEvent}
      />
    </div>
  )
}
