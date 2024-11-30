import { useState } from 'react'

import { useNavigate } from '@tanstack/react-router'

import { createEvent } from '~/backend/events'
import EventForm from '~/components/EventForm'
import Page from '~/components/Page'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import useErrors from '~/hooks/useErrors'

export default function AddEventPage() {
  const navigate = useNavigate()
  const { pushError } = useErrors()
  const [saving, setSaving] = useState<boolean>(false)
  useDocumentTitle('Add event')

  const handleSubmit = async options => {
    try {
      setSaving(true)
      const id: IDocId = await createEvent(options)
      if (id) {
        navigate({
          to: '/events/$id',
          params: { id }
        })
      }
    } catch (err) {
      pushError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Page>
      <EventForm onSubmit={handleSubmit} heading="Add event" saving={saving} />
    </Page>
  )
}
