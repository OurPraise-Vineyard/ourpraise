import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { fetchSong, saveSong } from '@backend/songs'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import SongForm from '@features/Songs/SongForm'
import { useAppDispatch } from '@hooks/state'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { pushError } from '@state/errorSlice'

function EditSong({ data: song }: IWithFetchProps<ISong>) {
  const { songId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useDocumentTitle(song ? `Edit song: "${song.title}"` : 'Edit song')

  const handleSubmit = async options => {
    try {
      await saveSong({
        ...options,
        id: songId
      })
      navigate('/songs/' + songId)
    } catch (err) {
      dispatch(pushError(err))
    }
  }

  if (!song) {
    return null
  }

  return <SongForm song={song} onSubmit={handleSubmit} heading="Edit song" />
}

export default withFetch<ISong>(params => fetchSong(params.songId as string))(
  EditSong
)
