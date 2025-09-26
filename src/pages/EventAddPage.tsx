import dateFormat from 'dateformat'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { createEvent } from '~/backend/events'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import { TextField, TextareaField } from '~/components/FormFields'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import type { IDocId } from '~/types/backend'
import type { IEventForm } from '~/types/forms'
import { nextWeekday } from '~/utils/date'

const defaultDate = dateFormat(nextWeekday(7), 'yyyy-mm-dd')

export default function AddEventPage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState<boolean>(false)
  const errorPopUp = useErrorPopUp()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IEventForm>()

  const onSave = async (options: IEventForm) => {
    try {
      setSaving(true)
      const id: IDocId = await createEvent(options)
      if (id) {
        navigate(`/events/${id}`)
      }
    } catch (err: any) {
      errorPopUp.show(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Page>
      <MetaTitle title="Add event" />
      <form
        className="flex flex-col gap-4 py-4"
        onSubmit={handleSubmit(onSave)}
      >
        <h2 className="text-title font-bold">Add event</h2>
        <TextField
          title="Title"
          fieldProps={register('title', { required: true })}
          error={errors.title && 'Title is required'}
        />
        <TextField
          type="date"
          title="Date"
          className="grow"
          defaultValue={defaultDate}
          fieldProps={register('date', { required: true })}
          error={errors.date && 'Date is required'}
        />
        <TextareaField title="Set comments" fieldProps={register('comment')} />
        <button type="submit" className="btn btn-primary w-full">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </Page>
  )
}
