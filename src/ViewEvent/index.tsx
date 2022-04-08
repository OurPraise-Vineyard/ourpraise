import { getFullEvent } from '@api/events'
import React, { useCallback, useEffect, useState } from 'react'
import Toolbar from '@ViewEvent/Toolbar'
import { useParams } from 'react-router-dom'
import ContentBox from '@Shared/ContentBox'
import SongItem from '@ViewEvent/SongItem'

export default function ViewEvent () {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)

  const handleFetchEvent = useCallback(() => {
    getFullEvent(eventId).then(setEvent)
  }, [eventId])

  useEffect(() => {
    handleFetchEvent()
  }, [handleFetchEvent])

  if (!event) {
    return null
  }

  return (
    <div>
      <Toolbar title={event.title} eventId={eventId} />
      {!!event.comment && (
        <ContentBox title="Comments">
          {event.comment}
        </ContentBox>
      )}
      <ContentBox noPadding title="Set list">
        {event.songs.map(song => (
          <SongItem key={song.id} song={song} />
        ))}
      </ContentBox>
    </div>
  )
}
