import React from 'react'

import { fetchSongLists } from '@backend/songLists'
import ContentTable from '@components/ContentTable'
import Toolbar from '@components/Toolbar'
import ToolbarButton from '@components/ToolbarButton'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import { useDocumentTitle } from '@hooks/useDocumentTitle'

function mapSongList(data) {
  return {
    primary: data.name,
    url: `/songlists/${data.id || data.objectID}`
  }
}

function SongLists({ data: songLists }: IWithFetchProps<ISongList[]>) {
  useDocumentTitle('Song Lists')

  return (
    <div>
      <Toolbar>
        <ToolbarButton to="/songlists/add">Add new songlist</ToolbarButton>
      </Toolbar>
      <ContentTable
        items={songLists}
        title={'Song Lists'}
        mapper={mapSongList}
      />
    </div>
  )
}

export default withFetch<ISongList[]>(fetchSongLists)(SongLists)
