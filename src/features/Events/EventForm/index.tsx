import TextField from '@features/Shared/TextField'
import React, { useEffect, useReducer, useState } from 'react'
import styled from 'styled-components'
import ButtonBase from '@features/Shared/ButtonBase'
import { useNavigate } from 'react-router-dom'
import dateFormat from 'dateformat'
import { deleteEvent } from '@features/Events/eventsSlice'
import AddSongs from '@features/Events/EventForm/AddSongs'
import FormSongItem from '@features/Events/EventForm/FormSongItem'
import { useAppDispatch, useAppSelector } from '@utils/hooks'
import SelectField, { SelectItem } from '@features/Shared/SelectField'
import { pushError } from '@utils/errorSlice'

const Container = styled.div`
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 20px;
`

const Heading = styled.h1`
  font-size: 36px;
  margin: 0 0 16px;
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
        songs: state.songs.map(song => song.id === action.songId
          ? ({
            ...song,
            transpose: action.transpose
          })
          : song)
      }
    case 'SET_COMMENT':
      return {
        ...state,
        songs: state.songs.map(song => song.id === action.songId
          ? ({
            ...song,
            comment: action.comment
          })
          : song)
      }
    case 'REMOVE_SONG':
      return {
        ...state,
        songs: state.songs.filter(song => song.id !== action.songId)
      }
    case 'INIT':
      return {
        ...state,
        ...action.state,
        organisation: state.organisation
      }
    default:
      return state
  }
}

const defaultEvent = {
  title: '',
  comment: '',
  date: dateFormat(new Date(), 'yyyy-mm-dd'),
  songs: [],
  organisation: ''
}

export default function EventForm ({ event = undefined, onSubmit, heading }: { event?: FullEvent, onSubmit: (options: EventFormType) => void, heading: string}) {
  const [{title, date, songs, comment, organisation}, dispatch] = useReducer(reducer, defaultEvent)
  const navigate = useNavigate()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const appDispatch = useAppDispatch()
  const organisations: SelectItem[] = useAppSelector<SelectItem[]>(state => [{ value: '', key: 'empty', label: 'No organisation', disabled: true }].concat(state.auth.organisations.map(org => ({
    label: org.name,
    value: org.id,
    key: org.id,
    disabled: false
  }))))
  const userOrg = useAppSelector(state => state.auth.organisation ? state.auth.organisation.id : '')
  const eventLoaded = !!event
  const eventOrg = event ? event.organisation : ''

  useEffect(() => {
    dispatch({ type: 'INIT', state: event || defaultEvent })
  }, [event])

  useEffect(() => {
    if (eventLoaded) {
      dispatch({
        type: 'SET',
        value: eventOrg || '',
        name: 'organisation'
      })
    } else {
      dispatch({
        type: 'SET',
        value: userOrg,
        name: 'organisation'
      })
    }
  }, [userOrg, eventLoaded, eventOrg])

  const handleChange = (name) => (e) => dispatch({
    type: 'SET',
    value: e.target.value,
    name
  })

  const handleSave = async (e) => {
    e.preventDefault()
    onSubmit({ title, date, songs, comment, id: undefined, organisation })
  }

  const handleDelete = async (e) => {
    if (window.confirm('Delete this event?')) {
      try {
        await appDispatch(deleteEvent(event)).unwrap()
        navigate('/events')
      } catch (err) {
        dispatch(pushError(err))
      }
    }
  }

  const handleAddSong = (song) => {
    dispatch({ type: 'ADD_SONG', song })
  }

  const handleChangeTranspose = (songId, transpose) => {
    dispatch({ type: 'SET_TRANSPOSE', songId, transpose })
  }

  const handleChangeSongComment = (songId, comment) => {
    dispatch({ type: 'SET_COMMENT', songId, comment })
  }

  const handleRemoveSong = (songId) => {
    dispatch({ type: 'REMOVE_SONG', songId })
  }

  return (
    <Container>
      <Heading>{heading}</Heading>
      <form onSubmit={handleSave}>
        <SelectField value={organisation} title="Organisation" onChange={handleChange('organisation')} options={organisations} />
        <TextField value={title} title="Title" onChange={handleChange('title')} />
        <TextField value={date} type="date" title="Date" onChange={handleChange('date')} />
        <TextField multiline value={comment} title="Set comments" onChange={handleChange('comment')} />
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
            <DeleteButton type="button" onClick={handleDelete}>Delete event</DeleteButton>
          )}
        </Buttons>
      </form>
      <AddSongs show={showAddDialog} onClose={() => setShowAddDialog(false)} onAddSong={handleAddSong} addedSongs={songs} />
    </Container>
  )
}
