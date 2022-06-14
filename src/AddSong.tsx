import React from 'react'
import { addSong } from '@slices/songs'
import { useNavigate } from 'react-router-dom'
import SongForm from '@Shared/SongForm'
import { useAppDispatch } from '@hooks'

export default function AddSong () {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleSubmit = async (options) => {
    try {
      const song: SongType = (await dispatch(addSong(options))).payload as SongType
      if (song.id) {
        navigate('/songs/' + song.id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <SongForm
      onSubmit={handleSubmit}
      heading="Add song"
    />
  )
}
