import React, { useEffect, useRef } from 'react'
import ContentTable from '@components/ContentTable'
import { formatDate, getTime, todayTime } from '@utils/date'
import { FetchStatus } from '@utils/api'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { fetchRecentEvents } from '@state/events/api'
import { pushError } from '@state/errorSlice'
import Toolbar from '@components/Toolbar'
import ToolbarButton from '@components/ToolbarButton'

function mapEvent (data) {
  return {
    primary: data.title,
    secondary: formatDate(data.date),
    url: `/events/${data.id || data.objectID}`
  }
}

export default function EventOverview () {
  useDocumentTitle('Events')
  const dispatch = useAppDispatch()
  const events = useAppSelector(state => state.events.allEvents)
  const statusAllEvents = useAppSelector(state => state.events.statusAllEvents)
  const today = useRef(todayTime())

  useEffect(() => {
    if (statusAllEvents === FetchStatus.idle) {
      dispatch(fetchRecentEvents())
        .unwrap()
        .catch(err => {
          dispatch(pushError(err))
        })
    }
  }, [dispatch, statusAllEvents])

  const upcoming: IPartialEvent[] = []
  const past: IPartialEvent[] = []

  for (const ev of events) {
    if (getTime(ev.date) >= today.current) {
      upcoming.push(ev)
    } else if (past.length < 8) {
      past.push(ev)
    }
  }

  return (
    <div>
      <Toolbar>
        <ToolbarButton to="/events/add">Add new event</ToolbarButton>
      </Toolbar>
      {upcoming.length > 0 && (
        <ContentTable items={upcoming} title={'Upcoming events'} mapper={mapEvent} />
      )}
      <ContentTable items={past} title={'Past events'} mapper={mapEvent} />
    </div>
  )
}
