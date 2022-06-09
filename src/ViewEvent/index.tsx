import React, { useCallback, useEffect } from 'react'
import Toolbar from '@ViewEvent/Toolbar'
import { useParams } from 'react-router-dom'
import ContentBox from '@Shared/ContentBox'
import SongItem from '@ViewEvent/SongItem'
import { useAppDispatch, useAppSelector } from '@hooks'
import { FetchStatus } from '@slices/utils'
import { fetchEvent } from '@slices/events'

export default function ViewEvent () {
  const { eventId } = useParams()
  const dispatch = useAppDispatch()
  const event = useAppSelector(state => state.events.fullEvents[eventId])
  const statusEvent = useAppSelector(state => state.events.statusEvent)

  const handleFetchEvent = useCallback(() => {
    dispatch(fetchEvent(eventId))
  }, [eventId, dispatch])

  useEffect(() => {
    handleFetchEvent()
  }, [handleFetchEvent])

  if (!event || statusEvent === FetchStatus.loading) {
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
