import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLoaderData, useNavigate } from 'react-router'

import { deleteEvent, saveEvent } from '~/backend/events'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import { TextField, TextareaField } from '~/components/FormFields'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import type { IEventForm } from '~/types/forms'
import type { IEvent } from '~/types/models'

export default function EditEventPage() {
  const event: IEvent = useLoaderData()
  const navigate = useNavigate()
  const [saving, setSaving] = useState<boolean>(false)
  const errorPopUp = useErrorPopUp()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IEventForm>()

  const onSave = async (data: IEventForm) => {
    try {
      setSaving(true)
      await saveEvent({ ...data, id: event.id })
      navigate(`/events/${event.id}`)
    } catch (err: any) {
      errorPopUp.show(err.message)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (window.confirm('Delete this event?')) {
      try {
        await deleteEvent(event.id)
        navigate('/events')
      } catch (err: any) {
        errorPopUp.show(err.message)
      }
    }
  }

  return (
    <Page>
      <MetaTitle title={`Edit event: ${event.title}`} />
      <form
        className="flex flex-col gap-4 py-4"
        onSubmit={handleSubmit(onSave)}
      >
        <h2 className="text-title font-bold">Edit event</h2>
        <TextField
          title="Title"
          defaultValue={event?.title}
          fieldProps={register('title', { required: true })}
          error={errors.title && 'Title is required'}
        />
        <TextField
          type="date"
          title="Date"
          className="grow"
          defaultValue={event?.date}
          fieldProps={register('date', { required: true })}
          error={errors.date && 'Date is required'}
        />
        <TextareaField
          title="Set comments"
          fieldProps={register('comment')}
          defaultValue={event?.comment}
        />
        <button type="submit" className="btn btn-primary w-full">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onDelete} className="btn btn-error btn-soft w-full">
          Delete event
        </button>
      </form>
    </Page>
  )
}
