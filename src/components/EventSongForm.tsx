import React from 'react'

import Block from '@blocks/Block'
import Button from '@blocks/Button'
import Form from '@blocks/Form'
import Modal from '@components/Modal'
import SelectField from '@components/form/SelectField'
import TextArea from '@components/form/Textarea'
import useEventSongForm from '@hooks/forms/useEventSongForm'
import { keysOptions } from '@utils/chords'

type EventSongFormProps = {
  eventSong: IEventSong
  show: boolean
  saving: boolean
  onSubmit: (song: IEventSong) => void
  onClose: () => void
}
export default function EventSongForm({
  eventSong,
  onSubmit,
  show,
  onClose,
  saving
}: EventSongFormProps) {
  const [form, setField] = useEventSongForm(eventSong, true)

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Modal title="Edit song" onClose={onClose} show={show}>
      <Form onSubmit={handleSubmit}>
        <TextArea
          onChange={value => setField('comment', value)}
          value={form.comment}
          title="Comment"
          size="small"
        />
        <SelectField
          value={form.transposeKey}
          onChange={value => setField('transposeKey', value)}
          options={keysOptions}
          title="Key"
        />
        <Block grow />
        <Button buttonStyle="primary" type="submit">
          {saving ? 'Saving...' : 'Save song details'}
        </Button>
      </Form>
    </Modal>
  )
}
