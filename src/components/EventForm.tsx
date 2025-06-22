import dateFormat from 'dateformat'
import { useForm } from 'react-hook-form'

import Button from '~/components/Button'
import type { IEventForm } from '~/types/forms'
import type { IEvent } from '~/types/models'
import { nextWeekday } from '~/utils/date'

import { TextField, TextareaField } from './FormFields'

const defaultDate = dateFormat(nextWeekday(7), 'yyyy-mm-dd')

export default function EventForm({
  event,
  onSubmit,
  heading,
  saving
}: {
  event?: IEvent
  onSubmit: (options: IEventForm) => void
  heading: string
  saving: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IEventForm>()

  const onSave = async (data: IEventForm) => {
    onSubmit({
      title: data.title,
      date: data.date,
      comment: data.comment
    })
  }

  return (
    <form className="flex flex-col gap-4 py-4" onSubmit={handleSubmit(onSave)}>
      <h2 className="text-title font-bold">{heading}</h2>
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
        defaultValue={event?.date || defaultDate}
        fieldProps={register('date', { required: true })}
        error={errors.date && 'Date is required'}
      />
      <TextareaField
        title="Set comments"
        fieldProps={register('comment')}
        defaultValue={event?.comment}
      />
      <Button variant="primary" type="submit" className="w-full">
        {saving ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
