import React, { useEffect } from 'react'
import ContentTable from '@features/Shared/Table'
import Toolbar from '@features/Events/Overview/Toolbar'
import formatDate from '@utils/date'
import { FetchStatus } from '@utils/api'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { fetchRecentEvents } from '@state/events/api'
import { pushError } from '@state/errorSlice'

function mapEvent(data) {
  return {
    primary: data.title,
    secondary: formatDate(data.date),
    url: `/events/${data.id || data.objectID}`
  }
}

export default function EventOverview() {
  useDocumentTitle('Events')
  const dispatch = useAppDispatch()
  const events = useAppSelector(state => state.events.allEvents)
  const statusAllEvents = useAppSelector(state => state.events.statusAllEvents)

  useEffect(() => {
    if (statusAllEvents === FetchStatus.idle) {
      dispatch(fetchRecentEvents())
        .unwrap()
        .catch(err => {
          dispatch(pushError(err))
        })
    }
  }, [dispatch, statusAllEvents])

  return (
    <div>
      <Toolbar />
      <ContentTable items={events} title={'Recent events'} mapper={mapEvent} />
    </div>
  )
}
