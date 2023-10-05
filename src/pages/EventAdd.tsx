import React from 'react'
import { useNavigate } from 'react-router-dom'
import EventForm from '@features/Events/EventForm'
import { useAppDispatch } from '@hooks/state'
import { pushError } from '@state/errorSlice'
import { createEvent } from '@backend/events'
import { useDocumentTitle } from '@hooks/useDocumentTitle'

export default function AddEvent () {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useDocumentTitle('Add event')

  const handleSubmit = async options => {
    try {
      const id: IDocId = await createEvent(options)
      if (id) {
        navigate('/events/' + id)
      }
    } catch (err) {
      dispatch(pushError(err))
    }
  }

  return <EventForm onSubmit={handleSubmit} heading="Add event" />
}
