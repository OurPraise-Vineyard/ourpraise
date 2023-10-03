import React, { useCallback, useEffect, useState } from 'react'
import Toolbar from '@features/Events/Event/Toolbar'
import { useNavigate, useParams } from 'react-router-dom'
import Song from '@features/Events/Event/Song'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { FetchStatus } from '@utils/api'
import { fetchEvent } from '@state/events/api'
import { pushError } from '@state/errorSlice'
import SongsOverview from '@features/Events/Event/SongsOverview'
import Comment from '@features/Events/Event/Comment'
import { Breaker } from '@styles/CommonStyles'
import styled from 'styled-components'

const StyledBreaker = styled(Breaker)`
  margin-top: 32px;
  @media print {
    display: none;
  }
`

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
      {!!event.comment && <Comment>{event.comment}</Comment>}
      <SongsOverview songs={event.songs} />
      <StyledBreaker />
      {event.songs.map((song, i) => (
        <Song song={song} />
      ))}
    </div>
  )
}
