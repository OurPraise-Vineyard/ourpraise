import KeySwitcher from '@features/Songs/Song/KeySwitcher'
import { transposeSong } from '@utils/chords'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  box-shadow: ${props => props.theme.boxShadow};
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
  color: ${props => props.theme.colors.textFaded};
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
  grid-template-areas: 'title chords' 'authors chords';
`

export default function Song ({ song, transposeKey, onChangeTranspose, onResetTranspose }) {
  const [showChords, setShowChords] = useState(true)
  const [formattedBody, setBody] = useState('')
  const songBody = song && song.body.replace(/^\/\//gm, '  ')
  const songKey = song && song.key
  useEffect(() => {
    if (songBody) {
      if (showChords) {
        if (songKey && transposeKey) {
          setBody(transposeSong(songBody, songKey, transposeKey))
        } else {
          setBody(songBody)
        }
      } else {
        setBody(
          songBody
            .split('\n')
            .map(line => (line.trim() === '//' ? '' : line))
            .filter(line => line.substr(0, 2) !== '//' || line.trim() === '//')
            .join('\n')
            .replace(/^\n+/, '')
        )
      }
    }
  }, [songBody, songKey, transposeKey, showChords])

  function handleToggleChords () {
    setShowChords(!showChords)
  }

  return (
    <Container>
      <Header>
        <Title>{song.title}</Title>
        <KeySwitcher
          transposeKey={transposeKey}
          setTransposeKey={onChangeTranspose}
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
