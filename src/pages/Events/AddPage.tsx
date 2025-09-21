import { useState } from 'react'
import { useNavigate } from 'react-router'

import { createEvent } from '~/backend/events'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import EventForm from '~/components/EventForm'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import type { IDocId } from '~/types/backend'
import type { IEventForm } from '~/types/forms'

export default function AddEventPage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState<boolean>(false)
  const errors = useErrorPopUp()

  const handleSubmit = async (options: IEventForm) => {
    try {
      setSaving(true)
      const id: IDocId = await createEvent(options)
      if (id) {
        navigate(`/events/${id}`)
      }
    } catch (err: any) {
      errors.show(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Page>
      <MetaTitle title="Add event" />
      <EventForm onSubmit={handleSubmit} heading="Add event" saving={saving} />
    </Page>
  )
}
