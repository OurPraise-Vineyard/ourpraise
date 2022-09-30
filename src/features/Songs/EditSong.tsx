import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SongForm from '@features/Songs/SongForm'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { fetchSong, saveSong } from '@state/songs/api'
import { pushError } from '@state/errorSlice'

export default function EditSong() {
  const { songId } = useParams()
  const navigate = useNavigate()
  const song = useAppSelector(state => state.songs.index[songId])
  const dispatch = useAppDispatch()
  useDocumentTitle(song ? `Edit song: "${song.title}"` : 'Edit song')

  const shouldFetch = songId && !song

  useEffect(() => {
    if (shouldFetch) {
      dispatch(fetchSong(songId))
    }
  }, [shouldFetch, songId, dispatch])

  const handleSubmit = async options => {
    try {
      await dispatch(
        saveSong({
          ...options,
          id: songId
        })
      )
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
