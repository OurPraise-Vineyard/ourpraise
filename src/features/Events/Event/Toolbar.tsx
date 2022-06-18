import { getFunctionUrl } from '@utils/functions'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { buttonBase } from '@features/Shared/ButtonBase'
import styled from 'styled-components'
import { useAppSelector } from '@hooks'

const Row = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
  margin: 0 0 16px;
  justify-content: flex-end;

  & > *:not(:last-child) {
    margin-right: 16px;
  }
`

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`

const ButtonExternal = styled.a`
  ${buttonBase}
  margin: 0;
  text-decoration: none;
`

const ButtonLink = styled(Link)`
  ${buttonBase}
  margin: 0;
  text-decoration: none;
`

const Chip = styled.span`
  padding: 4px 8px;
  background-color: #ccc;
  color: black;
  border-radius: 4px;
  font-size: 16px;
`

const Spacer = styled.span`
  flex: 1 0 auto;
`

export default function Toolbar () {
  const { eventId } = useParams()
  const event = useAppSelector(state => state.events.index[eventId])
  const orgName = useAppSelector(state => {
    const org = state.auth.organisations.find(({ id }) => id === event.organisation)
    if (org) {
      return org.name
    }
    return 'No organisation'
  })
  const userEmail = useAppSelector(state => state.auth.user.email)
  const userRole = useAppSelector(state => state.auth.organisation.roles[state.auth.user.email])
  const canEdit = userEmail === event.owner || userRole === 'admin'

  return (
    <Row>
      <Title>{event.title}</Title>
      <Chip>{orgName}</Chip>
      <Spacer />
      {canEdit && (
        <ButtonLink to={`/events/${eventId}/edit`}>
          Edit
        </ButtonLink>
      )}
      <ButtonExternal
        href={getFunctionUrl('pdf', { event: eventId })}
        target="_blank"
      >
        Download PDF
      </ButtonExternal>
    </Row>
  )
}
