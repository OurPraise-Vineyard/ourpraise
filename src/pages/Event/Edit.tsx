import { useState } from 'react'

import { getRouteApi } from '@tanstack/react-router'

import { deleteEvent, fetchEvent } from '~/backend/events'
import { saveEvent } from '~/backend/events'
import EventForm from '~/components/EventForm'
import Page from '~/components/Page'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import { RoutePath } from '~/router'

export const loader = ({ params }) => fetchEvent(params.id)

export default function EditEventPage({ routePath }: { routePath: RoutePath }) {
  const { useLoaderData, useNavigate } = getRouteApi(routePath)
  const event: IEvent = useLoaderData()
  const navigate = useNavigate()
  const [saving, setSaving] = useState<boolean>(false)
  useDocumentTitle(`Edit event: "${event.title}"`)

  const handleSubmit = async options => {
    try {
      setSaving(true)
      await saveEvent({ ...options, id: event.id })
      navigate({
        to: '/events/$id',
        params: { id: event.id }
      })
    } catch (err) {
      console.error(err)
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
            to: '/events'
          })
        } catch (err) {
          console.error(err)
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
