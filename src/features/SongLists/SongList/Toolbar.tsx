import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useAppSelector } from '@utils/hooks'
import IconButton from '@components/IconButton'
import editIcon from '@assets/edit.svg'

const Row = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
  margin: 0 0 16px;
  justify-content: flex-end;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 12px;
`

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
  flex: 1 0 auto;
`

const Spacer = styled.span`
  flex: 1 0 auto;
`

export default function Toolbar () {
  const { songListId } = useParams()
  const navigate = useNavigate()
  const songList = useAppSelector(state => state.songLists.index[songListId])
  const canEdit = useAppSelector(state => state.auth.user.role === 'admin')

  function handleEdit () {
    navigate(`/songlists/${songListId}/edit`)
  }

  return (
    <Row>
      <TitleRow>
        <Title>{songList.name}</Title>
      </TitleRow>
      <Spacer />
      {canEdit && <IconButton icon={editIcon} onClick={handleEdit} />}
    </Row>
  )
}
