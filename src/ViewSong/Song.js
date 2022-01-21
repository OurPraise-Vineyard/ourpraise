import { transposeBody } from 'chords'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 20px;
`

const Title = styled.h1`
  font-size: 36px;
  margin: 0;
`

const Authors = styled.h2`
  font-size: 20px;
  color: #aaaaaa;
  margin: 0;
`

const SongBody = styled.div`
  font-family: 'Oxygen Mono', monospace;
  margin: 16px 0;
  white-space: pre;
`

export default function Song ({ song, transpose }) {
  const [formattedBody, setBody] = useState('')
  const songBody = song && song.body
  useEffect(() => {
    if (songBody) {
      setBody(transposeBody(transpose, songBody))
    }
  }, [songBody, transpose])

  return (
    <Container>
      <Title>{song.title}</Title>
      <Authors>{song.authors}</Authors>
      <SongBody>{formattedBody}</SongBody>
    </Container>
  )
}
