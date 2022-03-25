import { getEvent } from '@api/events'
import React, { useEffect, useState } from 'react'
import ContentTable from '@Shared/Table'
import Toolbar from '@ViewEvent/Toolbar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ContentBox from '@Shared/ContentBox'
import { buttonBase } from '@Shared/ButtonBase'
import styled from 'styled-components'
import Modal from '@Shared/Modal'

function mapSong (data) {
  return {
    primary: data.title,
    secondary: data.authors,
    url: `/songs/${data.id || data.objectID}`
  }
}

const ButtonLink = styled(Link)`
  ${buttonBase}
  margin: 0;
  text-decoration: none;
`

export default function ViewEvent () {
  const { eventId, state } = useParams()
  const [event, setEvent] = useState(null)
  const navigate = useNavigate()

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
        actions={[
          <ButtonLink to={`/events/${eventId}/addsongs`}>
            Add songs
          </ButtonLink>
        ]}
      />
      <Modal
        onClose={() => navigate(`/events/${eventId}`)}
        show={state === 'addsongs'}
        title="Add songs"
      />
    </div>
  )
}
