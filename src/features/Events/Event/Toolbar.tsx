import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import IconButton from '@components/IconButton'
import editIcon from '@assets/edit.svg'
import downloadIcon from '@assets/download.svg'
import { formatDate } from '@utils/date'
import useAuth from '@hooks/useAuth'

const StyledIconButton = styled(IconButton)`
  @media print {
    display: none;
  }
`

const Row = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media print {
    display: block;
    border-bottom: 1px solid ${props => props.theme.colors.breaker};
    padding-bottom: 4px;
  }
`

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`

const EventDate = styled.span`
  padding: 4px 8px;
  background-color: ${props => props.theme.colors.chipBackground};
  color: black;
  border-radius: 4px;
  font-size: 16px;
  flex: 0 0 auto;

  @media print {
    color: ${props => props.theme.colors.textFaded};
    background-color: transparent;
    font-size: 22px;
    padding: 0;
  }
`

const Spacer = styled.span`
  flex: 1 0 auto;
  @media print {
    display: none;
  }
`

export default function Toolbar ({ event }: { event: IEvent }) {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const eventDate = useMemo(() => formatDate(event.date), [event.date])

  const handleDownload = () => {
    window.print()
  }

  function handleEdit () {
    navigate(`/events/${eventId}/edit`)
  }

  return (
    <Row>
      <Title>{event.title}</Title>
      <EventDate>{eventDate}</EventDate>
      <Spacer />
      <StyledIconButton icon={downloadIcon} onClick={handleDownload} />
      {user.role === 'admin' && <StyledIconButton icon={editIcon} onClick={handleEdit} />}
    </Row>
  )
}
