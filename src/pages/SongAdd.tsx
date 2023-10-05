import React from 'react'
import { useNavigate } from 'react-router-dom'
import SongForm from '@features/Songs/SongForm'
import { useAppDispatch } from '@hooks/state'
import { pushError } from '@state/errorSlice'
import { createSong } from '@backend/songs'
import { useDocumentTitle } from '@hooks/useDocumentTitle'

export default function AddSong () {
  useDocumentTitle('Add song')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleSubmit = async options => {
    try {
      const id: IDocId = await createSong(options)
      if (id) {
        navigate('/songs/' + id)
      }
    } catch (err) {
      dispatch(pushError(err))
    }
  }

  return <SongForm onSubmit={handleSubmit} heading="Add song" />
}
