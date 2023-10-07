import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { fetchSongList, saveSongList } from '@backend/songLists'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import SongListForm from '@features/SongLists/SongListForm'
import { useAppDispatch } from '@hooks/state'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { pushError } from '@state/errorSlice'

function EditSongList({ data: songList }: IWithFetchProps<ISongList>) {
  const { songListId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useDocumentTitle(
    songList ? `Edit song list: "${songList.name}"` : 'Edit song list'
  )

  const handleSubmit = async options => {
    try {
      await saveSongList({ ...options, id: songListId })
      navigate('/songlists/' + songListId)
    } catch (err) {
      dispatch(pushError(err))
    }
  }

  return (
    <SongListForm
      songList={songList}
      onSubmit={handleSubmit}
      heading="Edit song list"
    />
  )
}

export default withFetch<INoProps, ISongList>(params =>
  fetchSongList(params.songListId as string)
)(EditSongList)
