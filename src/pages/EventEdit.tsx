import { useState } from 'react';
import { useNavigate, useParams } from 'react-router'

import EventForm from '@components/EventForm'
import withFetch from '@components/withFetch'

import { fetchEvent, saveEvent } from '@backend/events'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useErrors from '@hooks/useErrors'

function EditEvent({ data: event }: { data: IEvent }) {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { pushError } = useErrors()
  const [saving, setSaving] = useState<boolean>(false)
  useDocumentTitle(event ? `Edit event: "${event.title}"` : 'Edit event')

  const handleSubmit = async options => {
    try {
      setSaving(true)
      await saveEvent({ ...options, id: eventId })
      navigate('/events/' + eventId)
    } catch (err) {
      pushError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <EventForm
      event={event}
      onSubmit={handleSubmit}
      heading="Edit event"
      saving={saving}
    />
  )
}

export default withFetch<INoProps, IEvent>(params =>
  fetchEvent(params.eventId as string)
)(EditEvent)
