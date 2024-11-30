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
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async options => {
    try {
      setSaving(true)
      await saveEvent({ ...options, id: event.id })
      navigate({
        to: '/events/$id',
        params: { id: event.id }
      })
    } catch (err: any) {
      setError(err.message)
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
        } catch (err: any) {
          setError(err.message)
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
      {error && <div className="text-red-500">{error}</div>}
    </Page>
  )
}
