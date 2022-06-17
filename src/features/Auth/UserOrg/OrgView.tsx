import { useAppSelector } from '@hooks'
import React from 'react'
import styled from 'styled-components'

const OrgName = styled.p`
  font-size: 24px;
  margin: 20px 0;
  text-align: center;
`

const Line = styled.div`
  height: 0;
  border-bottom: 1px solid #ccc;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export default function OrgView ({ selectedOrg }) {
  const organisation = useAppSelector(state => state.auth.organisations.find(({ id }) => id === selectedOrg))

  return (
    <Column>
      <OrgName>{organisation.name}</OrgName>
      <Line />
    </Column>
  )
}
