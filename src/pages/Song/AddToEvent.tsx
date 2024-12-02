import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { IEventsData, addSongToEvent, fetchEvents } from '~/backend/events'
import Button from '~/components/Button'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import Modal from '~/components/Modal'
import { FetchStatus, IDocId } from '~/types/backend'
import { IKey } from '~/types/models'
import { getKeyOptions } from '~/utils/chords'
import { formatDate } from '~/utils/date'

import { SelectField, TextareaField } from '../../components/FormFields'

type FormState = {
  comment: string
  key: IKey
}

export default function AddToEvent({
  songId,
  songKey,
  transposeKey,
  show,
  onClose,
  eventId,
  onAdded
}: {
  songId: IDocId
  songKey: IKey
  transposeKey: IKey
  show: boolean
  onClose: () => void
  eventId?: IDocId
  onAdded: () => void
}) {
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle')
  const [events, setEvents] = useState<IEventsData['upcoming']>([])
  const [selectedEvent, setSelectedEvent] = useState<IDocId>('')
  const [saving, setSaving] = useState<boolean>(false)
  const { getValues, register, handleSubmit, reset } = useForm<FormState>()
  const keysOptions = useMemo(() => getKeyOptions(songKey), [songKey])
  const errors = useErrorPopUp()

  useEffect(
    () => reset({ key: transposeKey, comment: getValues().comment }),
    [transposeKey]
  )

  useEffect(() => {
    if (show && fetchStatus === 'idle') {
      setFetchStatus('loading')
      fetchEvents()
        .then(data => {
          if (data.upcoming.length > 0) {
            setEvents(data.upcoming)
            if (eventId) {
              setSelectedEvent(eventId)
            }
          }
          setFetchStatus('succeeded')
        })
        .catch(() => setFetchStatus('failed'))
    }
  }, [songId, show])

  const onAdd = async (form: FormState) => {
    try {
      if (!selectedEvent) {
        throw new Error('No event selected')
      }
      setSaving(true)
      await addSongToEvent(selectedEvent, {
        id: songId,
        transposeKey: form.key,
        comment: form.comment
      })
      onAdded()
      onClose()
      setSaving(false)
      reset()
    } catch (err: any) {
      setSaving(false)
      onClose()
      errors.show(err.message)
    }
  }

  return (
    <Modal title="Add song to event" onClose={onClose} show={show}>
      <div className="flex flex-grow flex-col gap-3">
        <div className="flex-grow">
          <div className="overflow-y-auto">
            {fetchStatus === 'succeeded' &&
              events?.map(event => (
                <div
                  onClick={() => setSelectedEvent(event.id)}
                  key={event.id}
                  className={classNames(
                    'flex cursor-pointer justify-between gap-4 border-b border-gray-300 p-2 text-lg last:border-b-0 hover:bg-gray-100',
                    {
                      'bg-blue-100': event.id === selectedEvent
                    }
                  )}
                >
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {event.title}
                  </p>
                  <p className="min-w-max overflow-hidden text-ellipsis whitespace-nowrap">
                    {formatDate(event.date)}
                  </p>
                </div>
              ))}
            {fetchStatus === 'succeeded' && events?.length === 0 && (
              <p className="text-center">No upcoming events.</p>
            )}
            {fetchStatus === 'loading' && (
              <p className="text-center">Loading events...</p>
            )}
            {fetchStatus === 'failed' && (
              <p className="text-center text-red-500">
                Failed to load events. Try again later.
              </p>
            )}
          </div>
        </div>
        {!!selectedEvent && (
          <form onSubmit={handleSubmit(onAdd)} className="flex flex-col gap-3">
            <TextareaField
              title="Comment"
              size="small"
              fieldProps={register('comment')}
            />
            <SelectField
              options={keysOptions}
              title="Key"
              defaultValue={transposeKey}
              fieldProps={register('key')}
            />
            <Button type="submit" variant="primary">
              {saving ? 'Saving...' : 'Add song'}
            </Button>
          </form>
        )}
      </div>
    </Modal>
  )
}
