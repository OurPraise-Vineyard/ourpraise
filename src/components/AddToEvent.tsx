import React from 'react'

import { IEventsData, fetchEvents } from '@backend/events'
import Center from '@components/Center'
import CompactListItem from '@components/CompactListItem'
import Modal from '@components/Modal'
import useFetch from '@hooks/useFetch'
import { formatDate } from '@utils/date'

type AddToEventProps = {
  song: ISong
  show: boolean
  onClose: () => void
}
export default function AddToEvent({ song, show, onClose }: AddToEventProps) {
  const [status, events] = useFetch<IEventsData>(fetchEvents)

  return (
    <Modal title="Add song to event" narrow onClose={onClose} show={show}>
      {status === 'succeeded' &&
        events?.upcoming.map(event => (
          <CompactListItem
            to=""
            primary={event.title}
            secondary={formatDate(event.date)}
          />
        ))}
      {status === 'succeeded' && events?.upcoming.length === 0 && (
        <Center>No upcoming events.</Center>
      )}
      {status === 'loading' && <Center>Loading events...</Center>}
    </Modal>
  )
}
