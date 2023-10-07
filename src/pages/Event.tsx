import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import downloadIcon from '@assets/download.svg'
import editIcon from '@assets/edit.svg'
import addIcon from '@assets/plus-square.svg'
import { fetchEvent } from '@backend/events'
import IconButton from '@components/IconButton'
import SongListItem from '@components/SongListItem'
import SongsOverview from '@components/SongsBulletList'
import Tag from '@components/Tag'
import Toolbar from '@components/Toolbar'
import Title from '@components/text/Title'
import withFetch from '@components/withFetch'
import Comment from '@features/Events/Event/Comment'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { formatDate } from '@utils/date'

function EventPage({ data: event }: { data: IEvent }) {
  useDocumentTitle(event.title)
  const { eventId } = useParams()
  const navigate = useNavigate()
  const eventDate = useMemo(() => formatDate(event.date), [event.date])

  const handleDownload = () => {
    window.print()
  }

  function handleEdit() {
    navigate(`/events/${eventId}/edit`)
  }

  return (
    <div>
      <Toolbar>
        <Title>{event.title}</Title>
        <Tag>{eventDate}</Tag>
        <IconButton icon={editIcon} onClick={handleEdit} />
        <IconButton icon={downloadIcon} onClick={handleDownload} />
        <IconButton icon={addIcon} onClick={handleEdit} />
      </Toolbar>
      {!!event.comment && <Comment>{event.comment}</Comment>}
      <SongsOverview songs={event.songs} />
      {event.songs.map((song, i) => (
        <SongListItem
          key={song.id}
          title={song.title || ''}
          authors={song.authors || ''}
          body={song.body}
          formattedKey={song.formattedKey}
        />
      ))}
    </div>
  )
}

export default withFetch<INoProps, IEvent>(params =>
  fetchEvent(params.eventId as string)
)(EventPage)
