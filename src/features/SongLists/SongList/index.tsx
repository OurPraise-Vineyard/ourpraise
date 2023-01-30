import React, { Fragment, useCallback, useEffect, useState } from 'react'
import Toolbar from '@features/SongLists/SongList/Toolbar'
import { useNavigate, useParams } from 'react-router-dom'
import ContentBox from '@features/Shared/ContentBox'
import SongItem from '@features/SongLists/SongList/SongItem'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { FetchStatus } from '@utils/api'
import { pushError } from '@state/errorSlice'
import { Breaker } from '@styles/CommonStyles'
import styled from 'styled-components'
import { fetchSongList } from '@state/songLists/api'

const StyledBreaker = styled(Breaker)`
  margin: 0 20px;
`

export default function ViewSongList() {
  const { songListId } = useParams()
  const dispatch = useAppDispatch()
  const songList = useAppSelector(state => state.songLists.index[songListId])
  const [status, setStatus] = useState(FetchStatus.idle)
  const shouldFetch = songListId && !songList
  const navigate = useNavigate()
  useDocumentTitle(songList ? songList.name : '')

  const handleFetchSongList = useCallback(async () => {
    if (shouldFetch) {
      try {
        setStatus(FetchStatus.loading)
        const songList = await dispatch(fetchSongList(songListId)).unwrap()
        if (songList === null) {
          return navigate('/songlists')
        }
        setStatus(FetchStatus.succeeded)
      } catch (err) {
        dispatch(pushError(err))
        setStatus(FetchStatus.failed)
      }
    }
  }, [songListId, dispatch, shouldFetch, navigate])

  useEffect(() => {
    handleFetchSongList()
  }, [handleFetchSongList])

  if (!songList || status === FetchStatus.loading) {
    return null
  }

  return (
    <div>
      <Toolbar />
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
