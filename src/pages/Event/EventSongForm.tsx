import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import Button from '~/components/Button'
import Modal from '~/components/Modal'
import type { IEventSongForm } from '~/types/forms'
import type { IEventSong } from '~/types/models'
import { getKeyOptions } from '~/utils/chords'

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
  onSubmit: (song: IEventSongForm) => void
  onClose: () => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IEventSongForm>()

  const keysOptions = useMemo(
    () => getKeyOptions(eventSong.key),
    [eventSong.key]
  )

  useEffect(
    () =>
      reset({
        id: eventSong.id,
        comment: eventSong.comment,
        transposeKey: eventSong.transposeKey
      }),
    [eventSong.id, show]
  )

  return (
    <Modal title="Edit song options" onClose={onClose} show={show}>
      <form
        className="flex grow flex-col gap-4"
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
        <span className="grow" />
        <Button variant="primary" type="submit">
          {saving ? 'Saving...' : 'Save song details'}
        </Button>
      </form>
    </Modal>
  )
}
