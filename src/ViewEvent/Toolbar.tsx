import { getFunctionUrl } from 'api/functions'
import React from 'react'
import { Link } from 'react-router-dom'
import { buttonBase } from 'Shared/ButtonBase'
import styled from 'styled-components'

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
  flex: 1 0 auto;
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

export default function Toolbar ({ title, onSearch = undefined, eventId }) {
  return (
    <Row>
      <Title>{title}</Title>
      <ButtonLink to={`/events/${eventId}/edit`}>
        Edit details
      </ButtonLink>
      <ButtonExternal
        href={getFunctionUrl('pdf', { event: eventId })}
        target="_blank"
      >
        Download PDF
      </ButtonExternal>
    </Row>
  )
}
