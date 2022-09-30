import React from 'react'
import { addEvent } from '@state/events/api'
import { useNavigate } from 'react-router-dom'
import EventForm from '@features/Events/EventForm'
import { useAppDispatch, useDocumentTitle } from '@utils/hooks'
import { pushError } from '@state/errorSlice'

export default function AddEvent() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useDocumentTitle('Add event')

  const handleSubmit = async options => {
    try {
      const doc = await dispatch(addEvent(options)).unwrap()
      if (doc.id) {
        navigate('/events/' + doc.id)
      }
    } catch (err) {
      dispatch(pushError(err))
    }
  }

  return <EventForm onSubmit={handleSubmit} heading="Add event" />
}
