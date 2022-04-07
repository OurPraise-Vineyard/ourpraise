import { getFullEvent } from '@api/events'
import React, { useCallback, useEffect, useState } from 'react'
import ContentTable from '@Shared/Table'
import Toolbar from '@ViewEvent/Toolbar'
import { Link, useParams } from 'react-router-dom'
import ContentBox from '@Shared/ContentBox'
import { buttonBase } from '@Shared/ButtonBase'
import styled from 'styled-components'
import AddSongs from '@ViewEvent/AddSongs'

function mapSong (data, eventId) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/events/${eventId}/songs/${data.id}`,
    id: data.id
  }
}

const ButtonLink = styled(Link)`
  ${buttonBase}
  margin: 0;
  text-decoration: none;
`

export default function ViewEvent () {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)

  const handleFetchEvent = useCallback(() => {
    getFullEvent(eventId).then(event => setEvent({
      ...event,
      songs: event.songs.map(song => mapSong(song, eventId))
    }))
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
      <ContentTable
        items={event.songs}
        title={'Set list'}
        actions={(
          <>
            <ButtonLink to={`/events/${eventId}/addsongs`} replace>
              Add songs
            </ButtonLink>
            <ButtonLink to={`/events/${eventId}/editsongs`} replace>
              Edit set
            </ButtonLink>
          </>
        )}
      />
      <AddSongs addedSongs={event.songs} onRefreshEvent={handleFetchEvent} />
    </div>
  )
}
