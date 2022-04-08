import { streamSong } from '@api/songs'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EmojiButton from '@Shared/EmojiButton'
import styled from 'styled-components'
import Song from '@ViewSong/Song'
import Tools from '@ViewSong/Tools'
import MiniEvent from '@ViewSong/Event'
import { getFullEvent } from '@api/events'
import formatDate from '@date'
import SongComment from '@ViewSong/Comment'

function mapEvent (data) {
  return {
    ...data,
    date: formatDate(data.date)
  }
}

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
  const [song, setSong] = useState<SongType>(null)
  const [transpose, setTranspose] = useState(0)
  const [showChords, setShowChords] = useState(true)
  const [event, setEvent] = useState<EventType>(null)
  const navigate = useNavigate()

  const songLoaded = song && song.id === songId

  useEffect(() => {
    if (eventId) {
      getFullEvent(eventId).then(event => setEvent(mapEvent(event)))
    } else {
      setEvent(null)
    }
  }, [eventId])

  useEffect(() => {
    if (event && songLoaded) {
      setTranspose(event.songs.find(song => song.id === songId).transpose)
    }
  }, [songId, event, songLoaded])

  useEffect(() => {
    if (!eventId || event) {
      const stream = streamSong(songId)
        .subscribe(song => {
          if (event) {
            const songContext = event.songs.find(song => song.id === songId)
            setSong({
              ...song,
              comment: songContext.comment
            })
            setTranspose(songContext.transpose)
          } else {
            setSong(song)
            setTranspose(0)
          }
        })

      return () => stream.unsubscribe()
    }
  }, [songId, eventId, event])

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
          <MiniEvent event={event} />
        )}
      </Sidebar>
      <Content>
        {!!song.comment && <SongComment>{song.comment}</SongComment>}
        <Song song={song} transpose={transpose} showChords={showChords} />
      </Content>
    </Layout>
  )
}
