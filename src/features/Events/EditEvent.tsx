import React, { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EventForm from '@features/Events/EventForm'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { fetchEvent, saveEvent } from '@state/events/api'
import { pushError } from '@state/errorSlice'

export default function EditEvent() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const event = useAppSelector(state => state.events.index[eventId])
  useDocumentTitle(event ? `Edit event: "${event.title}"` : 'Edit event')

  const fetchFullEvent = useCallback(async () => {
    try {
      await dispatch(fetchEvent(eventId)).unwrap()
    } catch (err) {
      dispatch(pushError(err))
    }
  }, [dispatch, eventId])

  useEffect(() => {
    fetchFullEvent()
  }, [fetchFullEvent])

  const handleSubmit = async options => {
    try {
      await dispatch(saveEvent({ ...options, id: eventId })).unwrap()
      navigate('/events/' + eventId)
    } catch (err) {
      dispatch(pushError(err))
    }
  }

  return <EventForm event={event} onSubmit={handleSubmit} heading="Edit event" />
}
