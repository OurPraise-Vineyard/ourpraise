import React from 'react'
import Toolbar from '@features/Events/Event/Toolbar'
import Song from '@features/Events/Event/Song'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import SongsOverview from '@features/Events/Event/SongsOverview'
import Comment from '@features/Events/Event/Comment'
import { Breaker } from '@styles/CommonStyles'
import styled from 'styled-components'
import withFetch from '@components/withFetch'
import { fetchEvent } from '@backend/events'

const StyledBreaker = styled(Breaker)`
  margin-top: 32px;
  @media print {
    display: none;
  }
`

function EventPage ({ data: event }: { data: IEvent }) {
  useDocumentTitle(event.title)

  return (
    <div>
      <Toolbar event={event} />
      {!!event.comment && <Comment>{event.comment}</Comment>}
      <SongsOverview songs={event.songs} />
      <StyledBreaker />
      {event.songs.map((song, i) => (
        <Song key={song.id} song={song} />
      ))}
    </div>
  )
}

export default withFetch<IEvent>(params => fetchEvent(params.eventId as string))(EventPage)
