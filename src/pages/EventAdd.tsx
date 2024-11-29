import { useState } from 'react';
import { useNavigate } from 'react-router'

import EventForm from '@components/EventForm'

import { createEvent } from '@backend/events'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useErrors from '@hooks/useErrors'

export default function AddEvent() {
  const navigate = useNavigate()
  const { pushError } = useErrors()
  const [saving, setSaving] = useState<boolean>(false)
  useDocumentTitle('Add event')

  const handleSubmit = async options => {
    try {
      setSaving(true)
      const id: IDocId = await createEvent(options)
      if (id) {
        navigate('/events/' + id)
      }
    } catch (err) {
      pushError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <EventForm onSubmit={handleSubmit} heading="Add event" saving={saving} />
  )
}
