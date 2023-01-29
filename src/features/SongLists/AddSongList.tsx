import React from 'react'
import { addSongList } from '@state/songLists/api'
import { useNavigate } from 'react-router-dom'
import SongListForm from '@features/SongLists/SongListForm'
import { useAppDispatch, useDocumentTitle } from '@utils/hooks'
import { pushError } from '@state/errorSlice'

export default function AddSongList() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useDocumentTitle('Add song list')

  const handleSubmit = async options => {
    try {
      const doc = await dispatch(addSongList(options)).unwrap()
      if (doc.id) {
        navigate('/songlists/' + doc.id)
      }
    } catch (err) {
      dispatch(pushError(err))
    }
  }

  return <SongListForm onSubmit={handleSubmit} heading="Add song list" />
}
