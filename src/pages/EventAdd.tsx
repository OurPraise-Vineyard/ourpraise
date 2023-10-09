import React from 'react'
import { useNavigate } from 'react-router-dom'

import { createEvent } from '@backend/events'
import EventForm from '@components/EventForm'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useErrors from '@hooks/useErrors'

export default function AddEvent() {
  const navigate = useNavigate()
  const { pushError } = useErrors()
  useDocumentTitle('Add event')

  const handleSubmit = async options => {
    try {
      const id: IDocId = await createEvent(options)
      if (id) {
        navigate('/events/' + id)
      }
    } catch (err) {
      pushError(err)
    }
  }

  return <EventForm onSubmit={handleSubmit} heading="Add event" />
}
