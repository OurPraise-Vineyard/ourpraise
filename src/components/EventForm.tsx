import dateFormat from 'dateformat'
import { useForm } from 'react-hook-form'

import Button from '~/components/Button'
import { nextWeekday } from '~/utils/date'

import { TextField, TextareaField } from './FormFields'

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
  const { register, handleSubmit } = useForm<IEventForm>()

  const onSave = async (data: IEventForm) => {
    onSubmit({
      title: data.title,
      date: data.date,
      comment: data.comment
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
      <TextField
        type="date"
        title="Date"
        className="flex-grow"
        defaultValue={event?.date || defaultDate}
        fieldProps={register('date', { required: true })}
      />
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
