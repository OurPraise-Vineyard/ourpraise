import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Button from '~/components/Button'
import Modal from '~/components/Modal'
import { IEventSongForm } from '~/types/forms'
import { IEventSong } from '~/types/models'
import { keysOptions } from '~/utils/chords'

import { SelectField, TextareaField } from '../../components/FormFields'

export default function EventSongForm({
  eventSong,
  onSubmit,
  show,
  onClose,
  saving
}: {
  eventSong: IEventSong
  show: boolean
  saving: boolean
  onSubmit: (song: IEventSong) => void
  onClose: () => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IEventSongForm>()

  useEffect(() => reset(), [eventSong.id, show])

  return (
    <Modal title="Edit song options" onClose={onClose} show={show}>
      <form
        className="flex flex-grow flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        key={eventSong.id}
      >
        <input
          className="hidden"
          {...register('id')}
          defaultValue={eventSong.id}
        />
        <TextareaField
          title="Comment"
          size="small"
          fieldProps={register('comment')}
          defaultValue={eventSong.comment}
        />
        <SelectField
          options={keysOptions}
          title="Key"
          fieldProps={register('transposeKey', { required: true })}
          defaultValue={eventSong.transposeKey}
          error={errors.transposeKey && 'Key is required'}
        />
        <span className="flex-grow" />
        <Button variant="primary" type="submit">
          {saving ? 'Saving...' : 'Save song details'}
        </Button>
      </form>
    </Modal>
  )
}
