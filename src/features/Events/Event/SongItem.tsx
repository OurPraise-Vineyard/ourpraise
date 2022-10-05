import React, { useMemo } from 'react'
import styled from 'styled-components'
import { getRelativeChord } from '@utils/chords'
import { Link, useParams } from 'react-router-dom'
import AppTheme from '@styles/AppTheme'

const Container = styled(Link)`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: repeat(4, min-content);
  grid-template-areas: 'title key' 'authors key' 'comment comment' 'line line';
  padding: 10px 20px;
  margin-bottom: 10px;
  transition: background-color .2s ease-out;
  cursor: pointer;
  color: black;
  text-decoration: none;

  &:visited {
    color: black;
  }

  &:hover {
    background-color: ${AppTheme.colors.backgroundHover};
  }

  ::after {
    content: '';
    border-bottom: 1px solid ${AppTheme.colors.textFaded};
    display: block;
    grid-area: line;
    margin-top: 10px;
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
  color: ${AppTheme.colors.textFaded};
  grid-area: authors;
  align-self: start;
`

const PlayKey = styled.div`
  grid-area: key;
  justify-self: end;
  align-self: start;
  padding: 10px 30px;
  border-radius: 22px;
  background-color: ${AppTheme.colors.backgroundOffset};
  position: relative;
  border: 1px solid ${AppTheme.colors.borderOffset};
  font-size: 16px;
`

const Comment = styled.div`
  grid-area: comment;
  margin-top: 5px;
`

export default function SongItem ({ song }) {
  const { eventId } = useParams()
  const songKey = useMemo(() => {
    return getRelativeChord(song.key, song.transpose)
  }, [song.key, song.transpose])

  return (
    <Container to={`/events/${eventId}/songs/${song.id}`}>
      <SongTitle>{song.title}</SongTitle>
      <SongAuthors>{song.authors}</SongAuthors>
      <PlayKey>Key: {songKey}</PlayKey>
      <Comment>{song.comment}</Comment>
    </Container>
  )
}
