import React from 'react'
import { useNavigate } from 'react-router-dom'

import { deleteEvent } from '@backend/events'
import FlexGrow from '@blocks/FlexGrow'
import FlexRow from '@blocks/FlexRow'
import Form from '@blocks/Form'
import DeleteButton from '@blocks/form/DeleteButton'
import SaveButton from '@blocks/form/SaveButton'
import Title from '@blocks/text/Title'
import TextField from '@components/form/TextField'
import TextArea from '@components/form/Textarea'
import useEventForm from '@hooks/forms/useEventForm'
import useErrors from '@hooks/useErrors'

export default function EventForm({
  event,
  onSubmit,
  heading
}: {
  event?: IEvent
  onSubmit: (options: IEventForm) => void
  heading: string
}) {
  const [{ title, comment, date, songs }, setField] = useEventForm(event)
  const navigate = useNavigate()
  const { pushError } = useErrors()
  const canDelete = !!(event && event.id)

  const handleSave = async e => {
    e.preventDefault()
    onSubmit({ title, date, songs, comment })
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
    <Form onSubmit={handleSave}>
      <Title>{heading}</Title>
      <TextField
        value={title}
        title="Title"
        onChange={value => setField('title', value)}
      />
      <TextField
        value={date}
        type="date"
        title="Date"
        onChange={value => setField('date', value)}
      />
      <TextArea
        value={comment}
        title="Set comments"
        onChange={value => setField('comment', value)}
      />
      <FlexRow>
        <SaveButton width={canDelete ? '250px' : undefined} type="submit">
          Save
        </SaveButton>
        <FlexGrow />
        {canDelete && (
          <DeleteButton width="250px" type="button" onClick={handleDelete}>
            Delete event
          </DeleteButton>
        )}
      </FlexRow>
    </Form>
  )
}
