import Button from '@components/Button'
import Modal from '@components/Modal'

import useEventSongForm from '@hooks/forms/useEventSongForm'
import { keysOptions } from '@utils/chords'

import { SelectField, TextareaField } from './FormFields'

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
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextareaField
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
        <span className="flex-grow" />
        <Button variant="primary" type="submit">
          {saving ? 'Saving...' : 'Save song details'}
        </Button>
      </form>
    </Modal>
  )
}
