import React from 'react'
import { addEvent } from '@slices/events'
import { useNavigate } from 'react-router-dom'
import EventForm from '@Shared/EventForm'
import { useAppDispatch } from '@hooks'

export default function AddEvent () {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

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
