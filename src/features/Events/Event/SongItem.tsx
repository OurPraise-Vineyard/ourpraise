import React from 'react'
import styled from 'styled-components'
import { Link, useParams } from 'react-router-dom'

const Container = styled(Link)`
  display: grid;
  grid-template-columns: minmax(0, 3fr) 1fr;
  grid-template-rows: repeat(4, min-content);
  grid-template-areas: 'title key' 'authors key' 'comment comment' 'line line';
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

const PlayKey = styled.div`
  grid-area: key;
  justify-self: end;
  align-self: start;
  padding: 10px 30px;
  border-radius: 22px;
  background-color: ${props => props.theme.colors.subtleButtonBackground};
  position: relative;
  border: 1px solid ${props => props.theme.colors.subtleButtonBorder};
  font-size: 16px;
`

const Comment = styled.div`
  grid-area: comment;
  margin-top: 5px;
`

export default function SongItem ({ song }: { song: SongType }) {
  const { eventId } = useParams()

  return (
    <Container to={`/events/${eventId}/songs/${song.id}`}>
      <SongTitle>{song.title}</SongTitle>
      <SongAuthors>{song.authors}</SongAuthors>
      <PlayKey>Key: {song.transposeKey}</PlayKey>
      {song.comment && <Comment>{song.comment}</Comment>}
    </Container>
  )
}
