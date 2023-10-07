import React from 'react'
import { useNavigate } from 'react-router-dom'

import editIcon from '@assets/edit.svg'
import { fetchSongList } from '@backend/songLists'
import CompactListItem from '@components/CompactListItem'
import IconButton from '@components/IconButton'
import Toolbar from '@components/Toolbar'
import Title from '@components/text/Title'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'

function SongList({ data: songList }: IWithFetchProps<ISongList>) {
  useDocumentTitle(songList.name)
  const navigate = useNavigate()
  const { user } = useAuth()
  const canEdit = user?.role === 'admin'

  function handleEdit() {
    navigate(`/songlists/${songList.id}/edit`)
  }

  return (
    <div>
      <Toolbar>
        <Title>{songList.name}</Title>
        {canEdit && <IconButton icon={editIcon} onClick={handleEdit} />}
      </Toolbar>
      {songList.songs?.map((song, i) => (
        <CompactListItem
          key={song.id}
          to={`/songs/${song.id}`}
          primary={song.title}
          secondary={song.authors}
        />
      ))}
    </div>
  )
}

export default withFetch<INoProps, ISongList>(params =>
  fetchSongList(params.songListId as string)
)(SongList)
