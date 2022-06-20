import React, { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EventForm from '@features/Events/EventForm'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { fetchEvent, saveEvent } from '@features/Events/eventsSlice'
import { fetchEventSongs } from '@features/Songs/songsSlice'

export default function EditEvent () {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const event = useAppSelector(state => {
    if (!state.songs.views[`event_${eventId}`]) {
      return null
    }

    return {
      ...state.events.index[eventId],
      songs: state.songs.views[`event_${eventId}`]
    } as EventType
  })
  useDocumentTitle(event ? `Edit event: "${event.title}"` : 'Edit event')
  const shouldFetch = eventId && !event

  const fetchFullEvent = useCallback(async () => {
    if (shouldFetch) {
      const event = (await dispatch(fetchEvent(eventId))).payload
      if (event) {
        await dispatch(fetchEventSongs(eventId))
      }
    }
  }, [shouldFetch, dispatch, eventId])

  useEffect(() => {
    fetchFullEvent()
  }, [fetchFullEvent])

  const handleSubmit = async (options) => {
    try {
      await dispatch(saveEvent({ ...options, id: eventId }))
      navigate('/events/' + eventId)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <EventForm
      event={event}
      onSubmit={handleSubmit}
      heading="Edit event"
    />
  )
}
