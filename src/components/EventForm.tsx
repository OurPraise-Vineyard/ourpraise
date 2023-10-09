import dateFormat from 'dateformat'
import React, { useEffect, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { deleteEvent } from '@backend/events'
import ButtonBase from '@components/ButtonBase'
import FormSongItem from '@components/FormSongItem'
import TextField from '@components/form/TextField'
import TextArea from '@components/form/Textarea'
import useErrors from '@hooks/useErrors'
import { nextWeekday } from '@utils/date'

const Container = styled.div`
  box-shadow: ${props => props.theme.boxShadow};
  background-color: white;
  padding: 20px;
`

const Heading = styled.h1`
  font-size: ${props => props.theme.fontSizes.large};
  margin: 0;
`

const SubHeading = styled.h2`
  font-size: ${props => props.theme.fontSizes.regular};
  margin: 0 0 16px;
`

const Buttons = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const SaveButton = styled(ButtonBase).attrs({
  color: 'primary'
})`
  padding: 16px;
  margin: 8px 0;
  width: 250px;
`

const DeleteButton = styled(ButtonBase).attrs({
  color: 'danger'
})`
  padding: 16px;
  margin: 8px 0;
  width: 250px;
`

function reducer(state, action) {
  switch (action.type) {
    case 'SET':
      return {
        ...state,
        [action.name]: action.value
      }
    case 'ADD_SONG':
      return {
        ...state,
        songs: [
          ...state.songs,
          {
            title: action.song.title,
            authors: action.song.authors,
            id: action.song.id,
            key: action.song.key,
            transposeKey: action.song.key,
            comment: ''
          }
        ]
      }
    case 'SET_TRANSPOSE':
      return {
        ...state,
        songs: state.songs.map(song =>
          song.id === action.songId
            ? {
                ...song,
                transposeKey: action.transposeKey
              }
            : song
        )
      }
    case 'SET_COMMENT':
      return {
        ...state,
        songs: state.songs.map(song =>
          song.id === action.songId
            ? {
                ...song,
                comment: action.comment
              }
            : song
        )
      }
    case 'REMOVE_SONG':
      return {
        ...state,
        songs: state.songs.filter(song => song.id !== action.songId)
      }
    case 'INIT':
      return {
        ...state,
        ...action.state
      }
    default:
      return state
  }
}

const defaultEvent = {
  title: '',
  comment: '',
  date: dateFormat(nextWeekday(7), 'yyyy-mm-dd'),
  songs: []
}

export default function EventForm({
  event = undefined,
  onSubmit,
  heading
}: {
  event?: IEvent
  onSubmit: (options: IEventForm) => void
  heading: string
}) {
  const [{ title, date, songs, comment }, dispatch] = useReducer(
    reducer,
    defaultEvent
  )
  const navigate = useNavigate()
  const { pushError } = useErrors()

  useEffect(() => {
    dispatch({ type: 'INIT', state: event || defaultEvent })
  }, [event])

  const handleChange = name => e =>
    dispatch({
      type: 'SET',
      value: e.target.value,
      name
    })

  const handleSave = async e => {
    e.preventDefault()
    onSubmit({ title, date, songs, comment })
  }

  const handleDelete = async e => {
    if (event) {
      if (window.confirm('Delete this event?')) {
        try {
          await deleteEvent(event.id)
          navigate('/events')
        } catch (err) {
          pushError(err)
        }
      }
    }
  }

  const handleChangeTranspose = (songId, transposeKey) => {
    dispatch({ type: 'SET_TRANSPOSE', songId, transposeKey })
  }

  const handleChangeSongComment = (songId, comment) => {
    dispatch({ type: 'SET_COMMENT', songId, comment })
  }

  const handleRemoveSong = songId => {
    dispatch({ type: 'REMOVE_SONG', songId })
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
          value={date}
          type="date"
          title="Date"
          onChange={handleChange('date')}
        />
        <TextArea
          value={comment}
          title="Set comments"
          onChange={handleChange('comment')}
        />
        <SubHeading>Set list</SubHeading>
        {songs.map(song => (
          <FormSongItem
            key={song.id}
            showSongOptions
            song={song}
            transposeKey={song.transposeKey}
            comment={song.comment}
            onChangeTransposeKey={transpose =>
              handleChangeTranspose(song.id, transpose)
            }
            onChangeComment={comment =>
              handleChangeSongComment(song.id, comment)
            }
            onRemove={() => handleRemoveSong(song.id)}
          />
        ))}
        <Buttons>
          <SaveButton type="submit">Save</SaveButton>
          {!!(event && event.id) && (
            <DeleteButton type="button" onClick={handleDelete}>
              Delete event
            </DeleteButton>
          )}
        </Buttons>
      </form>
    </Container>
  )
}
