import React, { useMemo } from 'react'
import PageHeader from '@components/PageHeader'
import Song from '@features/Events/Event/Song'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import SongsOverview from '@features/Events/Event/SongsOverview'
import Comment from '@features/Events/Event/Comment'
import { Breaker } from '@styles/CommonStyles'
import styled from 'styled-components'
import withFetch from '@components/withFetch'
import { fetchEvent } from '@backend/events'
import Tag from '@components/Tag'
import FlexSpacer from '@components/FlexSpacer'
import IconButton from '@components/IconButton'
import editIcon from '@assets/edit.svg'
import downloadIcon from '@assets/download.svg'
import { formatDate } from '@utils/date'
import { useNavigate, useParams } from 'react-router-dom'
import useAuth from '@hooks/useAuth'

const StyledBreaker = styled(Breaker)`
  margin-top: 32px;
  @media print {
    display: none;
  }
`

const StyledIconButton = styled(IconButton)`
  @media print {
    display: none;
  }
`

function EventPage ({ data: event }: { data: IEvent }) {
  useDocumentTitle(event.title)
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const eventDate = useMemo(() => formatDate(event.date), [event.date])

  const handleDownload = () => {
    window.print()
  }

  function handleEdit () {
    navigate(`/events/${eventId}/edit`)
  }

  return (
    <div>
      <PageHeader title={event.title}>
        <Tag>{eventDate}</Tag>
        <FlexSpacer />
        <StyledIconButton icon={downloadIcon} onClick={handleDownload} />
        {user.role === 'admin' && <StyledIconButton icon={editIcon} onClick={handleEdit} />}
      </PageHeader>
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
