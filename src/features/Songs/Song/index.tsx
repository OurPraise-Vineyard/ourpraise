import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import Song from '@features/Songs/Song/Song'
import SongComment from '@features/Songs/Song/Comment'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { fetchEvent } from '@features/Events/eventsSlice'
import { fetchSong } from '@features/Songs/songsSlice'
import { pushError } from '@utils/errorSlice'
import IconButton from '@features/Shared/IconButton'
import backIcon from '@assets/arrow-left.svg'
import editIcon from '@assets/edit.svg'
import downloadIcon from '@assets/download.svg'
import { getFunctionUrl } from '@utils/functions'
import FlexSpacer from '@features/Shared/FlexSpacer'
import MiniEvent from '@features/Songs/Song/MiniEvent'

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

const FadeIn = styled.div`
  animation: ${fadeIn} .2s ease-out .2s both;
`

const Content = styled(FadeIn)`
  flex: 1 0 auto;
  max-width: calc(100%);
`

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`

export default function ViewSong () {
  const { songId, eventId } = useParams()
  const [transpose, setTranspose] = useState(0)
  const navigate = useNavigate()
  const event = useAppSelector(state => state.events.index[eventId])
  const song = useAppSelector(state => {
    if (eventId && state.events.index[eventId]) {
      return state.events.index[eventId].songsIndex[songId]
    } else if (!eventId) {
      return state.songs.index[songId]
    }
    return null
  })
  const hasOrg = useAppSelector(state => !!state.auth.organisation)
  const dispatch = useAppDispatch()
  useDocumentTitle(song ? song.title : '')

  const songLoaded = song && song.id === songId

  const songTranspose = song ? song.transpose : null

  const canEdit = hasOrg && !eventId

  useEffect(() => {
    (async () => {
      try {
        if (eventId) {
          await dispatch(fetchEvent(eventId)).unwrap()
        } else if (!eventId) {
          await dispatch(fetchSong(songId)).unwrap()
        }
      } catch (err) {
        dispatch(pushError(err))
      }
    })()
  }, [songId, dispatch, eventId])

  useEffect(() => setTranspose(songTranspose || 0), [songTranspose])

  function handleEdit () {
    navigate(`/songs/${songId}/edit`)
  }

  const handleBack = () => {
    if (eventId) {
      navigate(`/events/${eventId}`)
    } else if (songId) {
      navigate('/songs')
    }
  }

  const handleResetTranspose = () => {
    if (event && songLoaded) {
      setTranspose(event.songs.find(song => song.id === songId).transpose)
    } else {
      setTranspose(0)
    }
  }

  const handleDownload = () => {
    window.open(
      getFunctionUrl('pdf', { song: song.id, transpose }),
      '_blank'
    )
  }

  if (!song) {
    return null
  }

  return (
    <FadeIn>
      <TopRow>
        <IconButton icon={backIcon} onClick={handleBack} />
        <FlexSpacer />
        {!event && <IconButton icon={downloadIcon} onClick={handleDownload} />}
        {canEdit && <IconButton icon={editIcon} onClick={handleEdit} />}
        {!!event && <MiniEvent />}
      </TopRow>
      <Content key={songId}>
        {!!song.comment && <SongComment>{song.comment}</SongComment>}
        <Song
          song={song}
          transpose={transpose}
          onChangeTranspose={setTranspose}
          onResetTranspose={handleResetTranspose}
        />
      </Content>
    </FadeIn>
  )
}
