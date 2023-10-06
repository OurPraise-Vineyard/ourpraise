import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import downloadIcon from '@assets/download.svg'
import editIcon from '@assets/edit.svg'
import { fetchEvent } from '@backend/events'
import { Breaker } from '@components/Breaker'
import FlexSpacer from '@components/FlexSpacer'
import IconButton from '@components/IconButton'
import PageHeader from '@components/PageHeader'
import Song from '@components/SongListItem'
import SongsOverview from '@components/SongsBulletList'
import Tag from '@components/Tag'
import withFetch from '@components/withFetch'
import Comment from '@features/Events/Event/Comment'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { formatDate } from '@utils/date'

function EventPage({ data: event }: { data: IEvent }) {
  useDocumentTitle(event.title)
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const eventDate = useMemo(() => formatDate(event.date), [event.date])

  const handleDownload = () => {
    window.print()
  }

  function handleEdit() {
    navigate(`/events/${eventId}/edit`)
  }

  return (
    <div>
      <PageHeader title={event.title}>
        <Tag>{eventDate}</Tag>
        <FlexSpacer />
        <IconButton icon={downloadIcon} onClick={handleDownload} />
        {user.role === 'admin' && (
          <IconButton icon={editIcon} onClick={handleEdit} />
        )}
      </PageHeader>
      {!!event.comment && <Comment>{event.comment}</Comment>}
      <SongsOverview songs={event.songs} />
      <Breaker />
      {event.songs.map((song, i) => (
        <Song
          key={song.id}
          title={song.title}
          authors={song.authors}
          body={song.body}
          formattedKey={song.formattedKey}
        />
      ))}
    </div>
  )
}

export default withFetch<IEvent>(params =>
  fetchEvent(params.eventId as string)
)(EventPage)
