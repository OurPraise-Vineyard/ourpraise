import React, { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SongListForm from '@features/SongLists/SongListForm'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { pushError } from '@state/errorSlice'
import { fetchSongList, saveSongList } from '@state/songLists/api'

export default function EditSongList() {
  const { songListId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const songList = useAppSelector(state => state.songLists.index[songListId])
  useDocumentTitle(songList ? `Edit song list: "${songList.name}"` : 'Edit song list')

  const fetchFullSongList = useCallback(async () => {
    try {
      await dispatch(fetchSongList(songListId)).unwrap()
    } catch (err) {
      dispatch(pushError(err))
    }
  }, [dispatch, songListId])

  useEffect(() => {
    fetchFullSongList()
  }, [fetchFullSongList])

  const handleSubmit = async options => {
    try {
      await dispatch(saveSongList({ ...options, id: songListId })).unwrap()
      navigate('/songlists/' + songListId)
    } catch (err) {
      dispatch(pushError(err))
    }
  }

  return <SongListForm songList={songList} onSubmit={handleSubmit} heading="Edit song list" />
}
