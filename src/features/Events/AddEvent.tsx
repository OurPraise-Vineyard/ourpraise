import React from 'react'
import { addEvent } from '@features/Events/eventsSlice'
import { useNavigate } from 'react-router-dom'
import EventForm from '@features/Events/EventForm'
import { useAppDispatch, useDocumentTitle } from '@utils/hooks'

export default function AddEvent () {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useDocumentTitle('Add event')

  const handleSubmit = async (options) => {
    try {
      const doc = (await dispatch(addEvent(options))).payload as EventType
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
