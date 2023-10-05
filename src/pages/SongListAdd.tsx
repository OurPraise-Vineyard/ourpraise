import React from 'react'
import { useNavigate } from 'react-router-dom'
import SongListForm from '@features/SongLists/SongListForm'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { pushError } from '@state/errorSlice'
import { createSongList } from '@backend/songLists'
import { useAppDispatch } from '@hooks/state'

export default function AddSongList () {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useDocumentTitle('Add song list')

  const handleSubmit = async options => {
    try {
      const id = await createSongList(options)
      if (id) {
        navigate('/songlists/' + id)
      }
    } catch (err) {
      dispatch(pushError(err))
    }
  }

  return <SongListForm onSubmit={handleSubmit} heading="Add song list" />
}
