import React from 'react'
import { useNavigate } from 'react-router-dom'

import editIcon from '@assets/edit.svg'
import { fetchSongList } from '@backend/songLists'
import { Breaker } from '@components/Breaker'
import FlexSpacer from '@components/FlexSpacer'
import IconButton from '@components/IconButton'
import Link from '@components/Link'
import PageHeader from '@components/PageHeader'
import SongListItem from '@components/SongListItem'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'

function SongList({ data: songList }: IWithFetchProps<ISongList>) {
  useDocumentTitle(songList.name)
  const navigate = useNavigate()
  const { user } = useAuth()
  const canEdit = user.role === 'admin'

  function handleEdit() {
    navigate(`/songlists/${songList.id}/edit`)
  }

  return (
    <div>
      <PageHeader title={songList.name}>
        <FlexSpacer />
        {canEdit && <IconButton icon={editIcon} onClick={handleEdit} />}
      </PageHeader>
      <Breaker />
      {songList.songs.map((song, i) => (
        <Link key={song.id} to={`/songs/${song.id}`}>
          <SongListItem authors={song.authors} title={song.title} />
        </Link>
      ))}
    </div>
  )
}

export default withFetch<ISongList>(params =>
  fetchSongList(params.songListId as string)
)(SongList)
