import { getEvent, saveEvent } from '@api/events'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EventForm from '@Shared/EventForm'

export default function EditEvent () {
  const { eventId } = useParams()
  const [event, setEvent] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    getEvent(eventId).then(setEvent)
  }, [eventId])

  const handleSubmit = async (options) => {
    try {
      await saveEvent(eventId, options)
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
