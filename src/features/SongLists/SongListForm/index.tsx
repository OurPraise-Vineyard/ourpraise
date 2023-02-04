import TextField from '@features/Shared/TextField'
import React, { useEffect, useReducer, useState } from 'react'
import styled from 'styled-components'
import ButtonBase from '@features/Shared/ButtonBase'
import { useNavigate } from 'react-router-dom'
import { deleteSongList } from '@state/songLists/api'
import AddSongs from '@features/Shared/AddSongs'
import FormSongItem from '@features/SongLists/SongListForm/FormSongItem'
import { useAppDispatch, useAppSelector } from '@utils/hooks'
import { pushError } from '@state/errorSlice'
import { sortByTitleAsc } from '@utils/api'

const Container = styled.div`
  box-shadow: ${props => props.theme.boxShadow};
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

const Caption = styled.h2`
  font-size: 24px;
  margin: 0 0 16px;
  color: ${props => props.theme.colors.textFaded};
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
            transpose: 0,
            comment: ''
          }
        ].sort(sortByTitleAsc)
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

const defaultSongList = {
  name: '',
  songs: []
}

export default function SongListForm({
  songList = undefined,
  onSubmit,
  heading
}: {
  songList?: FullSongList
  onSubmit: (options: SongListFormType) => void
  heading: string
}) {
  const [{ name, songs }, dispatch] = useReducer(reducer, defaultSongList)
  const navigate = useNavigate()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const appDispatch = useAppDispatch()
  const songListOrg = songList ? songList.organisation : ''
  const songListOrgName = useAppSelector(state => {
    const org = songListOrg || (state.auth.organisation ? state.auth.organisation.id : '')
    if (org) {
      const orgData = state.auth.organisations.find(({ id }) => id === org)
      if (orgData) {
        return orgData.name
      }
    }
    return ''
  })

  useEffect(() => {
    dispatch({ type: 'INIT', state: songList || defaultSongList })
  }, [songList])

  const handleChange = name => e =>
    dispatch({
      type: 'SET',
      value: e.target.value,
      name
    })

  const handleSave = async e => {
    e.preventDefault()
    onSubmit({ name, songs, id: undefined })
  }

  const handleDelete = async e => {
    if (window.confirm('Delete this song list?')) {
      try {
        await appDispatch(deleteSongList(songList)).unwrap()
        navigate('/songlists')
      } catch (err) {
        dispatch(pushError(err))
      }
    }
  }

  const handleAddSong = song => {
    dispatch({ type: 'ADD_SONG', song })
  }

  const handleRemoveSong = songId => {
    dispatch({ type: 'REMOVE_SONG', songId })
  }

  return (
    <Container>
      <Heading>{heading}</Heading>
      <Caption>in {songListOrgName}</Caption>
      <form onSubmit={handleSave}>
        <TextField value={name} title="Name" onChange={handleChange('name')} />
        <SubHeading>Songs</SubHeading>
        {songs.map(song => (
          <FormSongItem key={song.id} song={song} onRemove={() => handleRemoveSong(song.id)} />
        ))}
        <ButtonBase type="button" fullWidth onClick={() => setShowAddDialog(true)}>
          Add songs
        </ButtonBase>

        <Buttons>
          <SaveButton type="submit">Save</SaveButton>
          {!!(songList && songList.id) && (
            <DeleteButton type="button" onClick={handleDelete}>
              Delete song list
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
