import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { fetchSong, saveSong } from '@backend/songs'
import SongForm from '@components/SongForm'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useErrors from '@hooks/useErrors'

function EditSong({ data: song }: IWithFetchProps<ISong>) {
  const { songId } = useParams()
  const navigate = useNavigate()
  const { pushError } = useErrors()
  useDocumentTitle(song ? `Edit song: "${song.title}"` : 'Edit song')

  const handleSubmit = async options => {
    try {
      await saveSong({
        ...options,
        id: songId
      })
      navigate('/songs/' + songId)
    } catch (err) {
      pushError(err)
    }
  }

  if (!song) {
    return null
  }

  return <SongForm song={song} onSubmit={handleSubmit} heading="Edit song" />
}

export default withFetch<INoProps, ISong>(params =>
  fetchSong(params.songId as string)
)(EditSong)
