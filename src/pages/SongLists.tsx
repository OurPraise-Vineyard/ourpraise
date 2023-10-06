import React from 'react'

import { fetchSongLists } from '@backend/songLists'
import CompactListItem from '@components/CompactListItem'
import Toolbar from '@components/Toolbar'
import ToolbarButton from '@components/ToolbarButton'
import Title from '@components/text/Title'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import { useDocumentTitle } from '@hooks/useDocumentTitle'

function SongLists({ data: songLists }: IWithFetchProps<ISongList[]>) {
  useDocumentTitle('Song Lists')

  return (
    <div>
      <Toolbar>
        <Title>Song lists</Title>
        <ToolbarButton to="/songlists/add">Add new songlist</ToolbarButton>
      </Toolbar>
      {songLists.map(songList => (
        <CompactListItem
          to={`/songlists/${songList.id}`}
          primary={songList.name}
        />
      ))}
    </div>
  )
}

export default withFetch<ISongList[]>(fetchSongLists)(SongLists)
