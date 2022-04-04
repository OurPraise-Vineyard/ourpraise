import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import styled from 'styled-components'
import _DownloadPdf from '@ViewSong/Tools/DownloadPdf'
import { getFunctionUrl } from '@api/functions'

const Container = styled.div`
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
  background-color: white;
  margin: 16px 0;
`

const Header = styled.div`
  padding: 20px 20px 0;
  margin-bottom: 20px;

  &::after {
    content: '';
    width: 60%;
    border-bottom: 1px solid #aaa;
    display: block;
    margin: 10px auto 0;
  }
`

const Title = styled.div`
  font-size: 24px;
  text-align: center;
  margin-bottom: 4px;
`

const EventDate = styled.div`
  font-size: 18px;
  color: #aaa;
  text-align: center;
`

const Item = styled(NavLink)`
  padding: 10px 20px;
  color: black;
  text-decoration: none;
  display: block;

  &::visited {
    color: black;
  }

  &.active {
    background-color: #E6E6E6;

    &::after {
      border-color: transparent;
    }
  }

  &::after {
    content: '';
    margin: 0 20px;
    border-bottom: 1px solid #aaa;
    display: block;
    margin: 2px auto 0;
  }
`

const ItemTitle = styled.p`
  margin: 0;
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`

const ItemAuthors = styled.p`
  color: #aaa;
  margin: 0;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`

const Footer = styled.div`
  padding: 20px;
`

const DownloadPdf = styled(_DownloadPdf)`
  margin-top: 0;
`

export default function MiniEvent ({ event }: { event: EventType }) {
  const { eventId } = useParams()

  if (!event) {
    return null
  }

  return (
    <Container>
      <Header>
        <Title>{event.title}</Title>
        <EventDate>{event.date}</EventDate>
      </Header>
      {event.songs.map(song => (
        <Item key={song.id} to={`/events/${eventId}/songs/${song.id}`}>
          <ItemTitle>{song.title}</ItemTitle>
          <ItemAuthors>{song.authors}</ItemAuthors>
        </Item>
      ))}
      <Footer>
        <DownloadPdf link={getFunctionUrl('pdf', { event: eventId })} label="Download set as PDF" />
      </Footer>
    </Container>
  )
}
