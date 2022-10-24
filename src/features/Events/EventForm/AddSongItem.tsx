import ButtonBase from '@features/Shared/ButtonBase'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 'title actions' 'authors actions';
  padding: 10px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`

const SongTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  grid-area: title;
  align-self: end;
`

const SongAuthors = styled.div`
  font-size: 18px;
  color: ${props => props.theme.colors.textFaded};
  grid-area: authors;
  align-self: start;
`

const Action = styled(ButtonBase)`
  margin: 0;
  grid-area: actions;
  justify-self: end;
  align-self: center;
`

const Added = styled.div`
  font-size: 20px;
  grid-area: actions;
  justify-self: end;
  align-self: center;
`

export default function AddSongItem ({ song, onAdd }) {
  return (
    <Container>
      <SongTitle>{song.title}</SongTitle>
      <SongAuthors>{song.authors}</SongAuthors>
      {song.added
        ? <Added>Added to set</Added>
        : <Action onClick={onAdd}>Add song</Action>}
    </Container>
  )
}
