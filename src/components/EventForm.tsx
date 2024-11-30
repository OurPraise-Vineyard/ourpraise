import dateFormat from 'dateformat'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import Button from '~/components/Button'
import { getLatestLocation, locations } from '~/hooks/useSavedLocation'
import { nextWeekday } from '~/utils/date'

import { SelectField, TextField, TextareaField } from './FormFields'

const defaultDate = dateFormat(nextWeekday(7), 'yyyy-mm-dd')

export default function EventForm({
  event,
  onSubmit,
  onDelete,
  heading,
  saving
}: {
  event?: IEvent
  onSubmit: (options: IEventForm) => void
  onDelete?: () => void
  heading: string
  saving: boolean
}) {
  const latestLocation = useMemo(() => getLatestLocation(), [])

  const { register, handleSubmit } = useForm<IEventForm>()

  const onSave = async data => {
    onSubmit({
      title: data.title,
      date: data.date,
      comment: data.comment,
      location: data.location
    })
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSave)}>
      <h2 className="text-title font-bold">{heading}</h2>
      <TextField
        title="Title"
        defaultValue={event?.title}
        fieldProps={register('title', { required: true })}
      />
      <div className="flex gap-3">
        <TextField
          type="date"
          title="Date"
          className="flex-grow"
          defaultValue={event?.date || defaultDate}
          fieldProps={register('date', { required: true })}
        />
        <SelectField
          title="Location"
          options={locations}
          className="flex-grow"
          defaultValue={event?.location || latestLocation}
          fieldProps={register('location', { required: true })}
        />
      </div>
      <TextareaField
        title="Set comments"
        fieldProps={register('comment')}
        defaultValue={event?.comment}
      />
      <div className="flex justify-between">
        <Button variant="primary" type="submit">
          {saving ? 'Saving...' : 'Save'}
        </Button>

        {!!onDelete && (
          <Button variant="danger" type="button" onClick={onDelete}>
            Delete event
          </Button>
        )}
      </div>
    </form>
  )
}
