import ChordSwitcher from '@features/Songs/Song/ChordSwitcher'
import { transposeBody } from '@utils/chords'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 20px;
  overflow-x: auto;
  max-width: 100%;
`

const Title = styled.h1`
  font-size: 36px;
  margin: 0;
  grid-area: title;
`

const Authors = styled.h2`
  font-size: 20px;
  color: #aaaaaa;
  margin: 0;
  grid-area: authors;
`

const SongBody = styled.div`
  font-family: 'Oxygen Mono', monospace;
  margin: 16px 0;
  white-space: pre;
`

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: "title chords" "authors chords";
`

export default function Song ({ song, transpose, onChangeTranspose, onResetTranspose }) {
  const [showChords, setShowChords] = useState(true)
  const [formattedBody, setBody] = useState('')
  const songBody = song && song.body
  useEffect(() => {
    if (songBody) {
      if (showChords) {
        setBody(transposeBody(transpose, songBody))
      } else {
        setBody(
          songBody
            .split('\n')
            .map(line => line.trim() === '//' ? '' : line)
            .filter(line => line.substr(0, 2) !== '//' || line.trim() === '//')
            .join('\n')
            .replace(/^\n+/, '')
        )
      }
    }
  }, [songBody, transpose, showChords])

  function handleToggleChords () {
    setShowChords(!showChords)
  }

  return (
    <Container>
      <Header>
        <Title>{song.title}</Title>
        <ChordSwitcher
          songKey={song.key}
          transpose={transpose}
          setTranspose={onChangeTranspose}
          onResetTranspose={onResetTranspose}
          onToggleChords={handleToggleChords}
          showChords={showChords}
        />
        <Authors>{song.authors}</Authors>
      </Header>
      <SongBody>{formattedBody}</SongBody>
    </Container>
  )
}
