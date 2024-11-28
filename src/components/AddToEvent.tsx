import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import Button from '@components/Button'
import Modal from '@components/Modal'

import { IEventsData, addSongToEvent, fetchEvents } from '@backend/events'
import useErrors from '@hooks/useErrors'
import useFetch from '@hooks/useFetch'
import { locations, useSavedLocation } from '@hooks/useSavedLocation'
import { keysOptions } from '@utils/chords'
import { formatDate } from '@utils/date'

import { SelectField, TextareaField } from './FormFields'

type AddToEventProps = {
  songId: IDocId
  songKey: IKey
  show: boolean
  onClose: () => void
}
export default function AddToEvent({
  songId,
  songKey,
  show,
  onClose
}: AddToEventProps) {
  const [status, events] = useFetch<IEventsData>(fetchEvents)
  const { pushError } = useErrors()
  const [selectedEvent, setSelectedEvent] = useState<IDocId>('')
  const [comment, setComment] = useState<string>('')
  const [transposeKey, setTransposeKey] = useState<IKey>(songKey)
  const [saving, setSaving] = useState<boolean>(false)
  const [location, setLocation] = useSavedLocation()
  const eventsFiltered = events?.upcoming.filter(e =>
    e.location ? e.location === location : location === locations[0].value
  )

  useEffect(() => {
    setTransposeKey(songKey)
  }, [songKey])

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!selectedEvent) {
        throw new Error('No event selected')
      }
      setSaving(true)
      await addSongToEvent(selectedEvent, { id: songId, transposeKey, comment })
      onClose()
      setSaving(false)
      setSelectedEvent('')
      setComment('')
    } catch (err) {
      setSaving(false)
      pushError(err)
    }
  }

  return (
    <Modal title="Add song to event" onClose={onClose} show={show}>
      <SelectField
        value={location}
        onChange={setLocation}
        options={locations}
      />
      <div className="mt-3 flex-grow">
        <div className="overflow-y-auto">
          {status === 'succeeded' &&
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
          {status === 'succeeded' && events?.upcoming.length === 0 && (
            <p className="text-center">No upcoming events.</p>
          )}
          {status === 'loading' && (
            <p className="text-center">Loading events...</p>
          )}
        </div>
      </div>
      {!!selectedEvent && (
        <div>
          <form onSubmit={handleAddSong}>
            <TextareaField
              onChange={setComment}
              value={comment}
              title="Comment"
              size="small"
            />
            <SelectField
              value={transposeKey}
              onChange={setTransposeKey}
              options={keysOptions}
              title="Key"
            />
            <Button type="submit" variant="primary">
              {saving ? 'Saving...' : 'Add song'}
            </Button>
          </form>
        </div>
      )}
    </Modal>
  )
}
