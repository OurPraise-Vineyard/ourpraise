import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { IEventsData, addSongToEvent, fetchEvents } from '~/backend/events'
import Button from '~/components/Button'
import Modal from '~/components/Modal'
import { locations, useSavedLocation } from '~/hooks/useSavedLocation'
import { keysOptions } from '~/utils/chords'
import { formatDate } from '~/utils/date'

import { SelectField, TextareaField } from './FormFields'
import Selector from './Selector'

type FormState = {
  comment: string
  key: IKey
}

export default function AddToEvent({
  songId,
  songKey,
  show,
  onClose
}: {
  songId: IDocId
  songKey: IKey
  show: boolean
  onClose: () => void
}) {
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle')
  const [events, setEvents] = useState<IEventsData['upcoming'] | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<IDocId>('')
  const [saving, setSaving] = useState<boolean>(false)
  const [location, setLocation] = useSavedLocation()
  const eventsFiltered = events?.filter(e =>
    e.location ? e.location === location : location === locations[0].value
  )
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, reset } = useForm<FormState>()

  useEffect(() => reset(), [show])

  useEffect(() => {
    if (show && fetchStatus === 'idle') {
      setFetchStatus('loading')
      fetchEvents()
        .then(data => {
          if (data.upcoming.length > 0) {
            setEvents(data.upcoming)
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
      onClose()
      setSaving(false)
      reset()
    } catch (err: any) {
      setSaving(false)
      setError(err.message)
    }
  }

  return (
    <Modal title="Add song to event" onClose={onClose} show={show}>
      <div className="flex flex-grow flex-col gap-3">
        <Selector
          value={location}
          onChange={loc => setLocation(loc.value as string)}
          options={locations}
        />
        <div className="flex-grow">
          <div className="overflow-y-auto">
            {fetchStatus === 'succeeded' &&
              eventsFiltered?.map(event => (
                <div
                  onClick={() => setSelectedEvent(event.id)}
                  key={event.id}
                  className={classNames(
                    'flex cursor-pointer justify-between gap-4 border-b border-gray-300 p-2 text-lg hover:bg-gray-100',
                    {
                      'bg-gray-100': event.id === selectedEvent
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
              defaultValue={songKey}
              fieldProps={register('key')}
            />
            <Button type="submit" variant="primary">
              {saving ? 'Saving...' : 'Add song'}
            </Button>
          </form>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </Modal>
  )
}
