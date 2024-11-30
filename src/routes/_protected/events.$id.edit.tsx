import { useState } from 'react'
import { requireLoggedIn } from '~/backend/auth'
import { deleteEvent, fetchEvent } from '~/backend/events'
import { saveEvent } from '~/backend/events'
import EventForm from '~/components/EventForm'
import Page from '~/components/Page'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import useErrors from '~/hooks/useErrors'

import { createFileRoute } from '@tanstack/react-router'
import { getRouteApi } from '@tanstack/react-router'

function EditEvent() {
  const { useLoaderData, useNavigate } = getRouteApi(
    '/_protected/events/$id/edit'
  )
  const event: IEvent = useLoaderData()
  const navigate = useNavigate()
  const { pushError } = useErrors()
  const [saving, setSaving] = useState<boolean>(false)
  useDocumentTitle(event ? `Edit event: "${event.title}"` : 'Edit event')

  const handleSubmit = async options => {
    try {
      setSaving(true)
      await saveEvent({ ...options, id: event.id })
      navigate({
        to: '/events/$id',
        params: { id: event.id }
      })
    } catch (err) {
      pushError(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (event) {
      if (window.confirm('Delete this event?')) {
        try {
          await deleteEvent(event.id)
          navigate({
            to: '/'
          })
        } catch (err) {
          pushError(err)
        }
      }
    }
  }

  return (
    <Page>
      <EventForm
        event={event}
        onSubmit={handleSubmit}
        heading="Edit event"
        saving={saving}
        onDelete={handleDelete}
      />
    </Page>
  )
}

export const Route = createFileRoute('/_protected/events/$id/edit')({
  beforeLoad: requireLoggedIn,
  loader: ({ params }) => fetchEvent(params.id),
  component: EditEvent
})
