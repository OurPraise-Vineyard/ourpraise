import TextField from '@Shared/TextField'
import React, { useEffect, useReducer } from 'react'
import styled from 'styled-components'
import ButtonBase from '@Shared/ButtonBase'
import { deleteSong } from '@api/songs'
import { useNavigate } from 'react-router-dom'
import dateFormat from 'dateformat'
import { deleteEvents } from '@api/events'

const Container = styled.div`
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 20px;
`

const Heading = styled.h1`
  font-size: 36px;
  margin: 0 0 16px;
`

const Buttons = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SaveButton = styled(ButtonBase).attrs({
  color: 'primary',
  fullWidth: true
})`
  padding: 16px;
  margin: 8px 0;
`

const DeleteButton = styled(ButtonBase).attrs({
  color: 'danger'
})`
  padding: 10px 80px;
  margin: 8px 0;
`

function reducer (state, action) {
  switch (action.type) {
    case 'SET':
      return {
        ...state,
        [action.name]: action.value
      }
    case 'INIT':
      return action.state
    default:
      return state
  }
}

// const defaultSong = {
//   transpose: 0,
//   id: '',
//   comment: ''
// }

const defaultEvent = {
  title: '',
  comment: '',
  date: dateFormat(new Date(), 'yyyy-mm-dd'),
  songs: []
}

export default function EventForm ({ event = undefined, onSubmit, heading }) {
  const [{title, date, songs, comment}, dispatch] = useReducer(reducer, defaultEvent)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch({ type: 'INIT', state: event || defaultEvent })
  }, [event])

  const handleChange = (name) => (e) => dispatch({
    type: 'SET',
    value: e.target.value,
    name
  })

  const handleSave = async (e) => {
    e.preventDefault()
    onSubmit({ title, date, songs, comment })
  }

  const handleDelete = async (e) => {
    if (window.confirm('Delete this event?')) {
      await deleteEvents(event.id)
      navigate('/events')
    }
  }

  return (
    <Container>
      <Heading>{heading}</Heading>
      <form onSubmit={handleSave}>
        <TextField value={title} title="Title" onChange={handleChange('title')} />
        <TextField value={date} type="date" title="Date" onChange={handleChange('date')} />
        <TextField multiline value={comment} title="Set comments" onChange={handleChange('comment')} />
        <Buttons>
          <SaveButton type="submit">Save</SaveButton>
          {!!(event && event.id) && (
            <DeleteButton type="button" onClick={handleDelete}>Delete</DeleteButton>
          )}
        </Buttons>
      </form>
    </Container>
  )
}
