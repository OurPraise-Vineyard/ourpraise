import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router'

import { saveEvent } from '~/backend/events'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import EventForm from '~/components/EventForm'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import type { IEventForm } from '~/types/forms'
import type { IEvent } from '~/types/models'

export default function EditEventPage() {
  const event: IEvent = useLoaderData()
  const navigate = useNavigate()
  const [saving, setSaving] = useState<boolean>(false)
  const errors = useErrorPopUp()

  const handleSubmit = async (options: IEventForm) => {
    try {
      setSaving(true)
      await saveEvent({ ...options, id: event.id })
      navigate(`/events/${event.id}`)
    } catch (err: any) {
      errors.show(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Page>
      <MetaTitle title={`Edit event: ${event.title}`} />
      <EventForm
        event={event}
        onSubmit={handleSubmit}
        heading="Edit event"
        saving={saving}
      />
    </Page>
  )
}
