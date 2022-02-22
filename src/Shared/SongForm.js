import SelectField from 'Shared/SelectField'
import TextField from 'Shared/TextField'
import React, { useEffect, useReducer } from 'react'
import styled from 'styled-components'
import ButtonBase from 'Shared/ButtonBase'
import { deleteSong } from 'api/songs'
import { useNavigate } from 'react-router-dom'

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

const defaultSong = {
  title: '',
  key: 'A',
  authors: '',
  body: ''
}

const keys = ['A', 'Ab', 'A#', 'B', 'Bb', 'B#', 'C', 'Cb', 'C#', 'D', 'Db', 'D#', 'E', 'Eb', 'E#', 'F', 'Fb', 'F#', 'G', 'Gb', 'G#']

export default function SongForm ({ song, onSubmit, heading }) {
  const [{title, authors, body, key}, dispatch] = useReducer(reducer, defaultSong)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch({ type: 'INIT', state: song || defaultSong })
  }, [song])

  const handleChange = (name) => (e) => dispatch({
    type: 'SET',
    value: e.target.value,
    name
  })

  const handleSave = async (e) => {
    e.preventDefault()
    onSubmit({ title, authors, body, key })
  }

  const handleDelete = async (e) => {
    if (window.confirm('Delete this song?')) {
      await deleteSong(song.id)
      navigate('/songs')
    }
  }

  return (
    <Container>
      <Heading>{heading}</Heading>
      <form onSubmit={handleSave}>
        <TextField value={title} title="Title" onChange={handleChange('title')} />
        <TextField value={authors} title="Authors" onChange={handleChange('authors')} />
        <SelectField value={key} title="Song Key" onChange={handleChange('key')} options={keys} />
        <TextField multiline value={body} title="Body" onChange={handleChange('body')} />
        <Buttons>
          <SaveButton type="submit">Save</SaveButton>
          {!!(song && song.id) && (
            <DeleteButton type="button" onClick={handleDelete}>Delete</DeleteButton>
          )}
        </Buttons>
      </form>
    </Container>
  )
}
