import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { fetchEvent, saveEvent } from '@backend/events'
import withFetch from '@components/withFetch'
import EventForm from '@features/Events/EventForm'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useErrors from '@hooks/useErrors'

function EditEvent({ data: event }: { data: IEvent }) {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { pushError } = useErrors()
  useDocumentTitle(event ? `Edit event: "${event.title}"` : 'Edit event')

  const handleSubmit = async options => {
    try {
      await saveEvent({ ...options, id: eventId })
      navigate('/events/' + eventId)
    } catch (err) {
      pushError(err)
    }
  }

  return (
    <EventForm event={event} onSubmit={handleSubmit} heading="Edit event" />
  )
}

export default withFetch<INoProps, IEvent>(params =>
  fetchEvent(params.eventId as string)
)(EditEvent)
