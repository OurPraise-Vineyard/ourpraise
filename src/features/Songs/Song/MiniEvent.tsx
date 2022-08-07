import React, { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useAppSelector } from '@utils/hooks'
import ButtonBase from '@features/Shared/ButtonBase'

const Container = styled.div<{ show: boolean }>`
  box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.2);
  background-color: white;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s ease-out;
  position: absolute;
  transform: translateX(-100%);

  ${props => props.show && css`
    opacity: 1;
    pointer-events: all;
  `}
`

const Backdrop = styled.div`
  position: fixed;
  z-index: 999;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
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

const Item = styled(NavLink)`
  padding: 10px 20px;
  color: black;
  text-decoration: none;
  display: block;

  &::visited {
    color: black;
  }

  &.active {
    background-color: #6fa7db;
    color: white;
    & > ${ItemAuthors} {
      color: #444;
    }
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

const Button = styled(ButtonBase)`
  margin: 0;
`

export default function MiniEvent () {
  const { eventId } = useParams()
  const event = useAppSelector(state => state.events.index[eventId])
  const [position, setPosition] = useState({ left: 0, top: 0 })
  const [show, setShow] = useState(false)
  const isLoading = !event

  function handleOpen (e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()

    const rect = e.currentTarget.getBoundingClientRect()
    setPosition({
      left: rect.right,
      top: rect.bottom + 8 + window.scrollY
    })
    setShow(true)
  }

  if (!event) {
    return null
  }

  return (
    <>
      <Button onClick={handleOpen}>Set list: {event.title}</Button>
      {show && <Backdrop onClick={() => setShow(false)} />}
      <Container style={position} show={show}>
        {isLoading
          ? 'Loading...'
          : event.songs.map(song => (
              <Item key={song.id} to={`/events/${eventId}/songs/${song.id}`} onClick={() => setShow(false)}>
                <ItemTitle>{song.title}</ItemTitle>
                <ItemAuthors>{song.authors}</ItemAuthors>
              </Item>
            ))}
      </Container>
    </>
  )
}
