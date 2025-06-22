import { useState } from 'react'

import { getRouteApi, notFound } from '@tanstack/react-router'

import { fetchEvent } from '~/backend/events'
import { saveEvent } from '~/backend/events'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import EventForm from '~/components/EventForm'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import type { RouteLoader, RoutePath } from '~/router'
import type { IEventForm } from '~/types/forms'
import type { IEvent } from '~/types/models'

export const loader: RouteLoader = async ({ params }) => {
  try {
    return await fetchEvent(params.id)
  } catch {
    throw notFound()
  }
}

export default function EditEventPage({ routePath }: { routePath: RoutePath }) {
  const { useLoaderData, useNavigate } = getRouteApi(routePath)
  const event: IEvent = useLoaderData()
  const navigate = useNavigate()
  const [saving, setSaving] = useState<boolean>(false)
  const errors = useErrorPopUp()

  const handleSubmit = async (options: IEventForm) => {
    try {
      setSaving(true)
      await saveEvent({ ...options, id: event.id })
      navigate({
        to: '/events/$id',
        params: { id: event.id }
      })
    } catch (err: any) {
      errors.show(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Page>
      <MetaTitle title={`Edit event: {event.title}`} />
      <EventForm
        event={event}
        onSubmit={handleSubmit}
        heading="Edit event"
        saving={saving}
      />
    </Page>
  )
}
