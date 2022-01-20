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

const Writer = styled.h2`
  font-size: 20px;
  color: #aaaaaa;
  margin: 0;
`

const SongBody = styled.div`
  font-family: 'Oxygen Mono', monospace;
`

export default function Song ({ song }) {
  const [formattedBody, setBody] = useState('')
  const songBody = song && song.body
  useEffect(() => {
    if (songBody) {
      setBody(
        songBody
          .replace(/\/\//g, ' ')
          .split('\n')
          .map(part => <div>{part}</div>)
        )
    }
  }, [songBody])

  return (
    <Container>
      <Title>{song.title}</Title>
      <Writer>{song.writer}</Writer>
      <SongBody>{formattedBody}</SongBody>
    </Container>
  )
}
