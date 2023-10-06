import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import editIcon from '@assets/edit.svg'
import { fetchSongList } from '@backend/songLists'
import ContentBox from '@components/ContentBox'
import FlexSpacer from '@components/FlexSpacer'
import IconButton from '@components/IconButton'
import PageHeader from '@components/PageHeader'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import SongItem from '@features/SongLists/SongList/SongItem'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { Breaker } from '@styles/CommonStyles'

const StyledBreaker = styled(Breaker)`
  margin: 0 20px;
`

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
      <ContentBox noPadding title="Songs">
        {songList.songs.map((song, i) => (
          <Fragment key={song.id}>
            <SongItem song={song} />
            {i !== songList.songs.length - 1 && <StyledBreaker />}
          </Fragment>
        ))}
      </ContentBox>
    </div>
  )
}

export default withFetch<ISongList>(params =>
  fetchSongList(params.songListId as string)
)(SongList)
