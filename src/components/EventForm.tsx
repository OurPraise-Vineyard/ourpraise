import React from 'react'
import { useNavigate } from 'react-router-dom'

import SelectField from '@components/form/SelectField'
import TextField from '@components/form/TextField'
import TextArea from '@components/form/Textarea'

import Block from '@blocks/Block'
import Button from '@blocks/Button'
import Form from '@blocks/Form'
import Title from '@blocks/text/Title'

import { deleteEvent } from '@backend/events'
import useEventForm from '@hooks/forms/useEventForm'
import useAuth from '@hooks/useAuth'
import useErrors from '@hooks/useErrors'

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
      location
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
    <Form onSubmit={handleSave}>
      <Title>{heading}</Title>
      <TextField
        value={title}
        title="Title"
        onChange={value => setField('title', value)}
      />
      <Block $flex="row">
        <TextField
          value={date}
          type="date"
          title="Date"
          onChange={value => setField('date', value)}
        />
        <SelectField
          value={location}
          title="Location"
          onChange={value => setField('location', value)}
          options={locations}
        />
      </Block>
      <TextArea
        value={comment}
        title="Set comments"
        onChange={value => setField('comment', value)}
      />
      <Block $flex="row">
        <Button $buttonStyle="primary" $width="250px" type="submit">
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Block $grow />
        {canDelete && (
          <Button
            $buttonStyle="danger"
            $width="250px"
            type="button"
            onClick={handleDelete}
          >
            Delete event
          </Button>
        )}
      </Block>
    </Form>
  )
}
