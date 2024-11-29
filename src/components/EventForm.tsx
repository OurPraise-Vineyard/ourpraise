import { pageTitleStyles } from '@common-styles'
import { useNavigate } from 'react-router'

import Button from '@components/Button'

import { deleteEvent } from '@backend/events'
import useEventForm from '@hooks/forms/useEventForm'
import useAuth from '@hooks/useAuth'
import useErrors from '@hooks/useErrors'
import { locations } from '@hooks/useSavedLocation'

import { SelectField, TextField, TextareaField } from './FormFields'

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
  const { user } = useAuth()
  const [
    { title, comment, date, songs, location = locations[0].value },
    setField
  ] = useEventForm(event)
  const navigate = useNavigate()
  const { pushError } = useErrors()
  const canDelete = !!(event && event.id)

  const handleSave = async e => {
    e.preventDefault()
    onSubmit({
      title,
      date,
      songs,
      comment,
      owner: user?.email || '',
      location: location ?? locations[0].value
    })
  }

  const handleDelete = async () => {
    if (event) {
      if (window.confirm('Delete this event?')) {
        try {
          await deleteEvent(event.id)
          navigate('/events')
        } catch (err) {
          pushError(err)
        }
      }
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSave}>
      <h2 className={pageTitleStyles}>{heading}</h2>
      <TextField
        value={title}
        title="Title"
        onChange={value => setField('title', value)}
      />
      <div className="flex gap-3">
        <TextField
          value={date}
          type="date"
          title="Date"
          onChange={value => setField('date', value)}
          className="flex-grow"
        />
        <SelectField
          value={location}
          title="Location"
          onChange={value => setField('location', value)}
          options={locations}
          className="flex-grow"
        />
      </div>
      <TextareaField
        value={comment}
        title="Set comments"
        onChange={value => setField('comment', value)}
      />
      <div className="flex justify-between">
        <Button variant="primary" type="submit">
          {saving ? 'Saving...' : 'Save'}
        </Button>

        {canDelete && (
          <Button variant="danger" type="button" onClick={handleDelete}>
            Delete event
          </Button>
        )}
      </div>
    </form>
  )
}
