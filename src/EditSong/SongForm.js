import Button from 'EditSong/Button'
import SelectField from 'EditSong/SelectField'
import TextField from 'EditSong/TextField'
import React, { useEffect, useReducer } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 20px;
`

const Heading = styled.h1`
  font-size: 36px;
  margin: 0 0 16px;
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

const keys = ['A', 'Ab', 'A#', 'B', 'Bb', 'B#', 'C', 'Cb', 'C#', 'D', 'Db', 'D#', 'E', 'Eb', 'E#', 'F', 'Fb', 'F#', 'G', 'Gb', 'G#']

export default function SongForm ({ song, onSubmit }) {
  const [{title, authors, body, key}, dispatch] = useReducer(reducer, song || {})

  useEffect(() => {
    dispatch({ type: 'INIT', state: song })
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

  return (
    <Container>
      <Heading>Edit song</Heading>
      <form onSubmit={handleSave}>
        <TextField value={title} title="Title" onChange={handleChange('title')} />
        <TextField value={authors} title="Authors" onChange={handleChange('authors')} />
        <SelectField value={key} title="Song Key" onChange={handleChange('key')} options={keys} />
        <TextField multiline value={body} title="Body" onChange={handleChange('body')} />
        <Button type="submit">Save</Button>
      </form>
    </Container>
  )
}
