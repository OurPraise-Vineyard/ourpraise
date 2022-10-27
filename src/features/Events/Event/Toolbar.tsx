import { getFunctionUrl } from '@utils/functions'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useAppSelector } from '@utils/hooks'
import IconButton from '@features/Shared/IconButton'
import editIcon from '@assets/edit.svg'
import downloadIcon from '@assets/download.svg'
import formatDate from '@utils/date'

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

const Chips = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
`

const Chip = styled.span`
  padding: 4px 8px;
  background-color: #e0e0e0;
  color: black;
  border-radius: 4px;
  font-size: 16px;
  flex: 0 0 auto;
`

const Spacer = styled.span`
  flex: 1 0 auto;
`

export default function Toolbar() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const event = useAppSelector(state => state.events.index[eventId])
  const userEmail = useAppSelector(state => state.auth.user.email)
  const userRole = useAppSelector(state => state.auth.organisation.roles[state.auth.user.email])
  const canEdit = userEmail === event.owner || userRole === 'admin'
  const eventDate = useMemo(() => formatDate(event.date), [event.date])

  const handleDownload = () => {
    window.open(getFunctionUrl('pdf', { event: eventId }), '_blank')
  }

  function handleEdit() {
    navigate(`/events/${eventId}/edit`)
  }

  return (
    <Row>
      <TitleRow>
        <Title>{event.title}</Title>
        <Chips>
          <Chip>{eventDate}</Chip>
          <Chip>{event.organisationName}</Chip>
        </Chips>
      </TitleRow>
      <Spacer />
      <IconButton icon={downloadIcon} onClick={handleDownload} />
      {canEdit && <IconButton icon={editIcon} onClick={handleEdit} />}
    </Row>
  )
}
