import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import Song from '@features/Songs/Song/Song'
import SongComment from '@features/Songs/Song/Comment'
import { useAppDispatch, useAppSelector, useDocumentTitle } from '@utils/hooks'
import { fetchSong } from '@state/songs/api'
import { pushError } from '@state/errorSlice'
import IconButton from '@features/Shared/IconButton'
import editIcon from '@assets/edit.svg'
import FlexSpacer from '@features/Shared/FlexSpacer'

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

const FadeIn = styled.div`
  animation: ${fadeIn} 0.2s ease-out 0.2s both;
`

const Content = styled(FadeIn)`
  flex: 1 0 auto;
  max-width: calc(100%);
`

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`

export default function ViewSong () {
  const { songId } = useParams()
  const [transposeKey, setTransposeKey] = useState<Key | null>(null)
  const navigate = useNavigate()
  const song = useAppSelector(state => state.songs.index[songId])
  const isAdmin = useAppSelector(state => state.auth.user.role === 'admin')
  const dispatch = useAppDispatch()
  useDocumentTitle(song ? song.title : '')

  const songLoaded = song && song.id === songId
  const songKey = song && song.key

  useEffect(() => {
    ;(async () => {
      try {
        await dispatch(fetchSong(songId)).unwrap()
      } catch (err) {
        dispatch(pushError(err))
      }
    })()
  }, [songId, dispatch])

  useEffect(() => setTransposeKey(songKey || null), [songKey])

  function handleEdit () {
    navigate(`/songs/${songId}/edit`)
  }

  const handleResetTranspose = () => {
    setTransposeKey(song.key)
  }

  if (!songLoaded) {
    return null
  }

  return (
    <FadeIn>
      <TopRow>
        <FlexSpacer />
        {isAdmin && <IconButton icon={editIcon} onClick={handleEdit} />}
      </TopRow>
      <Content key={songId}>
        {!!song.comment && <SongComment>{song.comment}</SongComment>}
        <Song
          song={song}
          transposeKey={transposeKey}
          onChangeTranspose={setTransposeKey}
          onResetTranspose={handleResetTranspose}
        />
      </Content>
    </FadeIn>
  )
}
