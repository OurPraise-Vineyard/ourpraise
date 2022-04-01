import { streamSong } from '@api/songs'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EmojiButton from '@Shared/EmojiButton'
import styled from 'styled-components'
import Song from '@ViewSong/Song'
import Tools from '@ViewSong/Tools'
import MiniEvent from '@ViewSong/Event'

const Layout = styled.div`
  display: flex;
  flex-direction: row;
`

const Sidebar = styled.div`
  flex: 1 0 auto;
  max-width: 300px;
  margin-right: 20px;
`

const Sticky = styled.div`
  position: sticky;
  top: 16px;
`

const Content = styled.div`
  flex: 1 0 auto;
  max-width: calc(100% - 300px);
`

export default function ViewSong () {
  const { songId, eventId } = useParams()
  const [song, setSong] = useState<any>({})
  const [transpose, setTranspose] = useState(0)
  const [showChords, setShowChords] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const stream = streamSong(songId)
      .subscribe(song => {
        setSong(song)
        setTranspose(0)
      })

    return () => stream.unsubscribe()
  }, [songId])

  function handleEdit () {
    navigate(`/songs/${songId}/edit`)
  }

  const handleBack = () => {
    if (eventId) {
      navigate( `/events/${eventId}`)
    } else if (songId) {
      navigate('/songs')
    }
  }

  return (
    <Layout>
      <Sidebar>
        <Sticky>
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
          />
          {!!eventId && (
            <MiniEvent />
          )}
        </Sticky>
      </Sidebar>
      <Content>
        <Song song={song} transpose={transpose} showChords={showChords} />
      </Content>
    </Layout>
  )
}
