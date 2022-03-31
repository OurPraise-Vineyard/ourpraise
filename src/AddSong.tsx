import React from 'react'
import { addSong } from '@api/songs'
import { useNavigate } from 'react-router-dom'
import SongForm from '@Shared/SongForm'

export default function AddSong () {
  const navigate = useNavigate()

  const handleSubmit = async (options) => {
    try {
      const doc = await addSong(options)
      if (doc.id) {
        navigate('/songs/' + doc.id)
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
