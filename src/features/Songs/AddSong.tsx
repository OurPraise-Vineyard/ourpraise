import React from 'react'
import { addSong } from '@state/songs/api'
import { useNavigate } from 'react-router-dom'
import SongForm from '@features/Songs/SongForm'
import { useAppDispatch, useDocumentTitle } from '@utils/hooks'
import { pushError } from '@state/errorSlice'

export default function AddSong() {
  useDocumentTitle('Add song')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleSubmit = async options => {
    try {
      const song: SongType = (await dispatch(addSong(options))).payload as SongType
      if (song.id) {
        navigate('/songs/' + song.id)
      }
    } catch (err) {
      dispatch(pushError(err))
    }
  }

  return <SongForm onSubmit={handleSubmit} heading="Add song" />
}
