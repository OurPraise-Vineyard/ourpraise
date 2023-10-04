import React, { useEffect } from 'react'
import ContentTable from '@components/ContentTable'
import Toolbar from '@features/SongLists/Overview/Toolbar'
import { FetchStatus } from '@utils/api'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { pushError } from '@state/errorSlice'
import { fetchSongLists } from '@state/songLists/api'

function mapSongList (data) {
  return {
    primary: data.name,
    url: `/songlists/${data.id || data.objectID}`
  }
}

export default function SongLists () {
  useDocumentTitle('Song Lists')
  const dispatch = useAppDispatch()
  const songLists = useAppSelector(state => state.songLists.songLists)
  const statusSongLists = useAppSelector(state => state.songLists.statusSongLists)

  useEffect(() => {
    if (statusSongLists === FetchStatus.idle) {
      dispatch(fetchSongLists())
        .unwrap()
        .catch(err => {
          dispatch(pushError(err))
        })
    }
  }, [dispatch, statusSongLists])

  return (
    <div>
      <Toolbar />
      <ContentTable items={songLists} title={'Song Lists'} mapper={mapSongList} />
    </div>
  )
}
