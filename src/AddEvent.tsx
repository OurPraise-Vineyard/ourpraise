import React from 'react'
import { addEvent } from 'api/events'
import { useNavigate } from 'react-router-dom'
import EventForm from 'Shared/EventForm'

export default function AddEvent () {
  const navigate = useNavigate()

  const handleSubmit = async (options) => {
    try {
      const doc = await addEvent(options)
      if (doc.id) {
        navigate('/events/' + doc.id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <EventForm
      onSubmit={handleSubmit}
      heading="Add event"
    />
  )
}
