import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EmojiButton from '@features/Shared/EmojiButton'
import styled from 'styled-components'
import Song from '@features/Songs/Song/Song'
import Tools from '@features/Songs/Song/Tools'
import MiniEvent from '@features/Songs/Song/Event'
import SongComment from '@features/Songs/Song/Comment'
import { useAppDispatch, useAppSelector } from '@hooks'
import { fetchEvent } from '@features/Events/eventsSlice'
import { fetchEventSongs, fetchSong } from '@features/Songs/songsSlice'

const Layout = styled.div`
  display: flex;
  flex-direction: row;
`

const Sidebar = styled.div`
  flex: 1 0 auto;
  max-width: 300px;
  margin-right: 20px;
`

const Content = styled.div`
  flex: 1 0 auto;
  max-width: calc(100% - 300px);
`

export default function ViewSong () {
  const { songId, eventId } = useParams()
  const [transpose, setTranspose] = useState(0)
  const [showChords, setShowChords] = useState(true)
  const navigate = useNavigate()
  const event = useAppSelector(state => state.events.index[eventId])
  const song = useAppSelector(state => state.songs.index[songId])
  const dispatch = useAppDispatch()

  const songLoaded = song && song.id === songId

  const shouldFetchEvent = !event
  const shouldFetchSong = !song

  const fetchFullEvent = useCallback(async () => {
    await dispatch(fetchEvent(eventId))
    await dispatch(fetchEventSongs(eventId))
  }, [dispatch, eventId])

  useEffect(() => {
    if (eventId && shouldFetchEvent) {
      fetchFullEvent()
    } else if (!eventId && shouldFetchSong) {
      dispatch(fetchSong(songId))
    }
  }, [shouldFetchEvent, fetchFullEvent, songId, dispatch, shouldFetchSong, eventId])

  useEffect(() => {
    if (song && song.transpose && transpose !== song.transpose) {
      setTranspose(song.transpose)
    } else if (!song && transpose !== 0) {
      setTranspose(0)
    }
  }, [song, transpose])

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

  if (!song) {
    return null
  }

  return (
    <Layout>
      <Sidebar>
        <EmojiButton emoji="👈️" onClick={handleBack}>
          Back
        </EmojiButton>
        {!eventId && (
          <EmojiButton emoji="✏️" onClick={handleEdit}>
            Edit
          </EmojiButton>
        )}
        <Tools
          songKey={song.key}
          songId={song.id}
          transpose={transpose}
          setTranspose={setTranspose}
          showChords={showChords}
          setShowChords={setShowChords}
          onResetTranspose={handleResetTranspose}
        />
        {!!eventId && (
          <MiniEvent />
        )}
      </Sidebar>
      <Content>
        {!!song.comment && <SongComment>{song.comment}</SongComment>}
        <Song song={song} transpose={transpose} showChords={showChords} />
      </Content>
    </Layout>
  )
}
