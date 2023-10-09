import React, { useEffect, useState } from 'react'

import { IEventsData, addSongToEvent, fetchEvents } from '@backend/events'
import Center from '@components/Center'
import CompactListItem from '@components/CompactListItem'
import FlexGrow from '@components/FlexGrow'
import Modal from '@components/Modal'
import ScrollContainer from '@components/ScrollContainer'
import SaveButton from '@components/form/SaveButton'
import SelectField from '@components/form/SelectField'
import TextArea from '@components/form/Textarea'
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

  useEffect(() => {
    setTransposeKey(songKey)
  }, [songKey])

  const handleAddSong = async () => {
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
    <Modal title="Add song to event" narrow onClose={onClose} show={show}>
      <FlexGrow>
        <ScrollContainer>
          {status === 'succeeded' &&
            events?.upcoming.map(event => (
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
      </FlexGrow>
      {!!selectedEvent && (
        <>
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
          <SaveButton onClick={handleAddSong}>
            {saving ? 'Saving...' : 'Add song'}
          </SaveButton>
        </>
      )}
    </Modal>
  )
}
