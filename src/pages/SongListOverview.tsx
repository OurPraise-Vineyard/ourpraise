import React from 'react'
import ContentTable from '@components/ContentTable'
import Toolbar from '@features/SongLists/Overview/Toolbar'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import { fetchSongLists } from '@backend/songLists'

function mapSongList (data) {
  return {
    primary: data.name,
    url: `/songlists/${data.id || data.objectID}`
  }
}

function SongLists ({ data: songLists }: IWithFetchProps<ISongList[]>) {
  useDocumentTitle('Song Lists')

  return (
    <div>
      <Toolbar />
      <ContentTable items={songLists} title={'Song Lists'} mapper={mapSongList} />
    </div>
  )
}

export default withFetch<ISongList[]>(fetchSongLists)(SongLists)
