import { getFullEvent } from '@api/events'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 20px;
  margin: 16px 0;
`

const Header = styled.div`
  &::after {
    content: '';
    width: 50%;
    border-bottom: 1px solid #aaa;
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

interface SongType {
  title: string,
  authors: string,
  id: string
}

interface EventType {
  title: string,
  date: string,
  songs: Array<SongType>,
  id: string
}

export default function MiniEvent () {
  const { eventId } = useParams()
  const [event, setEvent]: [EventType, (val) => void] = useState(null)

  useEffect(() => {
    if (eventId) {
      getFullEvent(eventId).then(setEvent)
    }
  }, [eventId])

  if (!event) {
    return null
  }

  return (
    <Container>
      <Header>
        <Title>{event.title}</Title>
        <EventDate>{event.date}</EventDate>
      </Header>
    </Container>
  )
}
