import React, { useEffect, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { deleteSong } from '@backend/songs'
import ButtonBase from '@components/ButtonBase'
import SelectField from '@components/form/SelectField'
import TextField from '@components/form/TextField'
import TextArea from '@components/form/Textarea'
import useErrors from '@hooks/useErrors'
import { keysOptions } from '@utils/chords'

const Container = styled.div`
  box-shadow: ${props => props.theme.boxShadow};
  background-color: white;
  padding: 20px;
`

const Heading = styled.h1`
  font-size: ${props => props.theme.fontSizes.large};
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

interface ReducerType {
  body: string
  title: string
  key: IKey
  authors: string
}

function reducer(state: ReducerType, action): ReducerType {
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

const defaultSong: ISongForm = {
  title: '',
  key: 'A',
  authors: '',
  body: '',
  id: ''
}

export default function SongForm({
  song = undefined,
  onSubmit,
  heading
}: {
  song?: ISong
  onSubmit: (options: ISongForm) => void
  heading: string
}) {
  const [{ title, authors, body, key }, dispatch] = useReducer(
    reducer,
    defaultSong
  )
  const navigate = useNavigate()
  const { pushError } = useErrors()

  useEffect(() => {
    dispatch({ type: 'INIT', state: song || defaultSong })
  }, [song])

  const handleChange = name => e =>
    dispatch({
      type: 'SET',
      value: e.target.value,
      name
    })

  const handleSave = async e => {
    e.preventDefault()
    onSubmit({ title, authors, body, key, id: undefined })
  }

  const handleDelete = async e => {
    if (song) {
      if (window.confirm('Delete this song?')) {
        try {
          await deleteSong(song.id)
          navigate('/songs')
        } catch (err) {
          pushError(err)
        }
      }
    }
  }

  return (
    <Container>
      <Heading>{heading}</Heading>
      <form onSubmit={handleSave}>
        <TextField
          value={title}
          title="Title"
          onChange={handleChange('title')}
        />
        <TextField
          value={authors}
          title="Authors"
          onChange={handleChange('authors')}
        />
        <SelectField
          value={key}
          title="Song Key"
          onChange={handleChange('key')}
          options={keysOptions}
        />
        <TextArea
          size="large"
          value={body}
          title="Body"
          onChange={handleChange('body')}
        />
        <Buttons>
          <SaveButton type="submit">Save</SaveButton>
          {!!(song && song.id) && (
            <DeleteButton type="button" onClick={handleDelete}>
              Delete
            </DeleteButton>
          )}
        </Buttons>
      </form>
    </Container>
  )
}
