import React, { useEffect, useState } from 'react'

import CompactListItem from '@components/CompactListItem'
import Modal from '@components/Modal'
import SelectField from '@components/form/SelectField'
import TextArea from '@components/form/Textarea'

import Block from '@blocks/Block'
import Button from '@blocks/Button'
import Center from '@blocks/Center'
import Form from '@blocks/Form'
import ScrollContainer from '@blocks/ScrollContainer'

import { IEventsData, addSongToEvent, fetchEvents } from '@backend/events'
import useErrors from '@hooks/useErrors'
import useFetch from '@hooks/useFetch'
import { keysOptions } from '@utils/chords'
import { formatDate } from '@utils/date'

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
  const [activeLocation, setActiveLocation] = useState<string>(localStorage.getItem('event_location') || 'aav');
  const eventsFiltered = events?.upcoming.filter(e => e.location === activeLocation);

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
        value={activeLocation}
        onChange={setActiveLocation}
        options={[
          { value: 'aav', label: 'Aarhus Vineyard' },
          { value: 'rov', label: 'Roskilde Vineyard' },
        ]}
      />
      <Block $grow>
        <ScrollContainer>
          {status === 'succeeded' &&
            eventsFiltered?.map(event => (
              <CompactListItem
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                primary={event.title}
                secondary={formatDate(event.date)}
                highlight={event.id === selectedEvent}
              />
            ))}
          {status === 'succeeded' && events?.upcoming.length === 0 && (
            <Center>No upcoming events.</Center>
          )}
          {status === 'loading' && <Center>Loading events...</Center>}
        </ScrollContainer>
      </Block>
      {!!selectedEvent && (
        <div>
          <Form onSubmit={handleAddSong}>
            <TextArea
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
            <Button type="submit" $buttonStyle="primary">
              {saving ? 'Saving...' : 'Add song'}
            </Button>
          </Form>
        </div>
      )}
    </Modal>
  )
}
