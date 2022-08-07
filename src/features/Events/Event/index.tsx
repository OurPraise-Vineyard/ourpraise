import React, { useCallback, useEffect, useState } from 'react'
import Toolbar from '@features/Events/Event/Toolbar'
import { useNavigate, useParams } from 'react-router-dom'
import ContentBox from '@features/Shared/ContentBox'
import SongItem from '@features/Events/Event/SongItem'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { FetchStatus } from '@utils/api'
import { fetchEvent } from '@features/Events/eventsSlice'
import { pushError } from '@utils/errorSlice'

export default function ViewEvent () {
  const { eventId } = useParams()
  const dispatch = useAppDispatch()
  const event = useAppSelector(state => state.events.index[eventId])
  const [status, setStatus] = useState(FetchStatus.idle)
  const shouldFetch = eventId && !event
  const navigate = useNavigate()
  useDocumentTitle(event ? event.title : '')

  const handleFetchEvent = useCallback(async () => {
    if (shouldFetch) {
      try {
        setStatus(FetchStatus.loading)
        const event = await dispatch(fetchEvent(eventId)).unwrap()
        if (event === null) {
          return navigate('/events')
        }
        setStatus(FetchStatus.succeeded)
      } catch (err) {
        dispatch(pushError(err))
        setStatus(FetchStatus.failed)
      }
    }
  }, [eventId, dispatch, shouldFetch, navigate])

  useEffect(() => {
    handleFetchEvent()
  }, [handleFetchEvent])

  if (!event || status === FetchStatus.loading) {
    return null
  }

  return (
    <div>
      <Toolbar />
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
