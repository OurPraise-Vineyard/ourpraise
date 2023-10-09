import React from 'react'
import { useNavigate } from 'react-router-dom'

import { createSong } from '@backend/songs'
import SongForm from '@components/SongForm'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useErrors from '@hooks/useErrors'

export default function AddSong() {
  useDocumentTitle('Add song')
  const navigate = useNavigate()
  const { pushError } = useErrors()

  const handleSubmit = async options => {
    try {
      const id: IDocId = await createSong(options)
      if (id) {
        navigate('/songs/' + id)
      }
    } catch (err) {
      pushError(err)
    }
  }

  return <SongForm onSubmit={handleSubmit} heading="Add song" />
}
