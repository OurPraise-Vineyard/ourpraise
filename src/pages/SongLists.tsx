import React from 'react'
import ContentTable from '@components/ContentTable'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import { fetchSongLists } from '@backend/songLists'
import ToolbarButton from '@components/ToolbarButton'
import Toolbar from '@components/Toolbar'

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
      <Toolbar>
        <ToolbarButton to="/songlists/add">Add new songlist</ToolbarButton>
      </Toolbar>
      <ContentTable items={songLists} title={'Song Lists'} mapper={mapSongList} />
    </div>
  )
}

export default withFetch<ISongList[]>(fetchSongLists)(SongLists)
