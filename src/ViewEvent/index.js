import { getEvent } from 'api/events'
import React, { useEffect, useState } from 'react'
import ContentTable from 'Shared/Table'
import Toolbar from 'ViewEvent/Toolbar'
import { useParams } from 'react-router-dom'
import ContentBox from 'Shared/ContentBox'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id || data.objectID}`
  }
}

export default function ViewEvent () {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)

  useEffect(() => {
    getEvent(eventId).then(event => setEvent({
      ...event,
      songs: event.songs.map(mapSong)
    }))
  }, [eventId])

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
      <ContentTable
        items={event.songs}
        title={'Set list'}
      />
    </div>
  )
}
