import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Container = styled(Link)`
  display: block;
  padding: 16px 10px;
  margin: 0 10px;
  border-radius: 4px;
  transition: background-color 0.2s ease-out;
  cursor: pointer;
  color: black;
  text-decoration: none;

  &:visited {
    color: black;
  }

  &:hover {
    background-color: ${props => props.theme.colors.backgroundHover};
    transition: background-color 0.1s ease-in;
  }
`

const SongTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  grid-area: title;
  align-self: end;
  overflow: hidden;
  text-overflow: ellipsis;
`

const SongAuthors = styled.div`
  font-size: 18px;
  color: ${props => props.theme.colors.textFaded};
  grid-area: authors;
  align-self: start;
  overflow: hidden;
  text-overflow: ellipsis;
`

export default function SongItem ({ song }: { song: ISong }) {
  return (
    <Container to={`/songs/${song.id}`}>
      <SongTitle>{song.title}</SongTitle>
      <SongAuthors>{song.authors}</SongAuthors>
    </Container>
  )
}
