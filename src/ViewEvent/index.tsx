import React, { useCallback, useEffect, useState } from 'react'
import Toolbar from '@ViewEvent/Toolbar'
import { useParams } from 'react-router-dom'
import ContentBox from '@Shared/ContentBox'
import SongItem from '@ViewEvent/SongItem'
import { useAppDispatch, useAppSelector } from '@hooks'
import { FetchStatus } from '@slices/utils'
import { fetchEvent } from '@slices/events'
import { fetchEventSongs } from '@slices/songs'

export default function ViewEvent () {
  const { eventId } = useParams()
  const dispatch = useAppDispatch()
  const event = useAppSelector(state => {
    if (!state.songs.views[`event_${eventId}`]) {
      return null
    }

    return {
      ...state.events.index[eventId],
      songs: state.songs.views[`event_${eventId}`]
    }
  })
  const [status, setStatus] = useState(FetchStatus.idle)
  const shouldFetch = eventId && !event

  const handleFetchEvent = useCallback(async () => {
    if (shouldFetch) {
      try {
        setStatus(FetchStatus.loading)
        const event = (await dispatch(fetchEvent(eventId))).payload
        if (event) {
          await dispatch(fetchEventSongs(eventId))
        }
        setStatus(FetchStatus.succeeded)
      } catch (err) {
        console.log(err)
        setStatus(FetchStatus.failed)
      }
    }
  }, [eventId, dispatch, shouldFetch])

  useEffect(() => {
    handleFetchEvent()
  }, [handleFetchEvent])

  if (!event || status === FetchStatus.loading) {
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
