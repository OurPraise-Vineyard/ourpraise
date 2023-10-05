import React, { Fragment } from 'react'
import Toolbar from '@features/SongLists/SongList/Toolbar'
import ContentBox from '@components/ContentBox'
import SongItem from '@features/SongLists/SongList/SongItem'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { Breaker } from '@styles/CommonStyles'
import styled from 'styled-components'
import withFetch, { IWithFetchProps } from '@components/withFetch'
import { fetchSongList } from '@backend/songLists'

const StyledBreaker = styled(Breaker)`
  margin: 0 20px;
`

function SongList ({ data: songList }: IWithFetchProps<ISongList>) {
  useDocumentTitle(songList.name)

  return (
    <div>
      <Toolbar songList={songList} />
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

export default withFetch<ISongList>(params => fetchSongList(params.songListId as string))(SongList)
