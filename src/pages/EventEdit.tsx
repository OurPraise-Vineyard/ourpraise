import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EventForm from '@features/Events/EventForm'
import { useAppDispatch } from '@hooks/state'
import { pushError } from '@state/errorSlice'
import withFetch from '@components/withFetch'
import { fetchEvent, saveEvent } from '@backend/events'
import { useDocumentTitle } from '@hooks/useDocumentTitle'

function EditEvent ({ data: event }: { data: IEvent }) {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useDocumentTitle(event ? `Edit event: "${event.title}"` : 'Edit event')

  const handleSubmit = async options => {
    try {
      await saveEvent({ ...options, id: eventId })
      navigate('/events/' + eventId)
    } catch (err) {
      dispatch(pushError(err))
    }
  }

  return <EventForm event={event} onSubmit={handleSubmit} heading="Edit event" />
}

export default withFetch<IEvent>(params => fetchEvent(params.eventId as string))(EditEvent)
