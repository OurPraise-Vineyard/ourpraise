import TextField from '@features/Shared/TextField'
import React, { useEffect, useReducer, useState } from 'react'
import styled from 'styled-components'
import ButtonBase from '@features/Shared/ButtonBase'
import { useNavigate } from 'react-router-dom'
import dateFormat from 'dateformat'
import { deleteEvent } from '@state/events/api'
import AddSongs from '@features/Shared/AddSongs'
import FormSongItem from '@features/Events/EventForm/FormSongItem'
import { useAppDispatch } from '@utils/hooks'
import { pushError } from '@state/errorSlice'
import { nextWeekday } from '@utils/date'

const Container = styled.div`
  box-shadow: ${props => props.theme.boxShadow};
  background-color: white;
  padding: 20px;
`

const Heading = styled.h1`
  font-size: 36px;
  margin: 0;
`

const SubHeading = styled.h2`
  font-size: 30px;
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

function reducer (state, action) {
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
            transpose: 0,
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
                transpose: action.transpose
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

export default function EventForm ({
  event = undefined,
  onSubmit,
  heading
}: {
  event?: FullEvent
  onSubmit: (options: EventFormType) => void
  heading: string
}) {
  const [{ title, date, songs, comment }, dispatch] = useReducer(reducer, defaultEvent)
  const navigate = useNavigate()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const appDispatch = useAppDispatch()

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
    if (window.confirm('Delete this event?')) {
      try {
        await appDispatch(deleteEvent(event)).unwrap()
        navigate('/events')
      } catch (err) {
        dispatch(pushError(err))
      }
    }
  }

  const handleAddSong = song => {
    dispatch({ type: 'ADD_SONG', song })
  }

  const handleChangeTranspose = (songId, transpose) => {
    dispatch({ type: 'SET_TRANSPOSE', songId, transpose })
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
        <TextField value={title} title="Title" onChange={handleChange('title')} />
        <TextField value={date} type="date" title="Date" onChange={handleChange('date')} />
        <TextField
          multiline
          value={comment}
          title="Set comments"
          onChange={handleChange('comment')}
        />
        <SubHeading>Set list</SubHeading>
        {songs.map(song => (
          <FormSongItem
            key={song.id}
            song={song}
            onChangeTranspose={transpose => handleChangeTranspose(song.id, transpose)}
            onChangeComment={comment => handleChangeSongComment(song.id, comment)}
            onRemove={() => handleRemoveSong(song.id)}
          />
        ))}
        <ButtonBase type="button" fullWidth onClick={() => setShowAddDialog(true)}>
          Add songs
        </ButtonBase>

        <Buttons>
          <SaveButton type="submit">Save</SaveButton>
          {!!(event && event.id) && (
            <DeleteButton type="button" onClick={handleDelete}>
              Delete event
            </DeleteButton>
          )}
        </Buttons>
      </form>
      <AddSongs
        show={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddSong={handleAddSong}
        addedSongs={songs}
      />
    </Container>
  )
}
