import { useState } from 'react'

import { useNavigate } from '@tanstack/react-router'

import { createEvent } from '~/backend/events'
import EventForm from '~/components/EventForm'
import Page from '~/components/Page'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import { IDocId } from '~/types/backend'
import { IEventForm } from '~/types/forms'

export default function AddEventPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)
  useDocumentTitle('Add event')

  const handleSubmit = async (options: IEventForm) => {
    try {
      setSaving(true)
      const id: IDocId = await createEvent(options)
      if (id) {
        navigate({
          to: '/events/$id',
          params: { id }
        })
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Page>
      <EventForm onSubmit={handleSubmit} heading="Add event" saving={saving} />
      {error && <div className="text-red-500">{error}</div>}
    </Page>
  )
}
