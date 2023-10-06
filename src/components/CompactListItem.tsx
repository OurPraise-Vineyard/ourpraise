import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  text-decoration: none;
  padding: 6px 0;
  border-radius: 4px;
  transition: background-color 0.2s ease-in;
  position: relative;
  z-index: 2;

  :hover {
    background-color: ${props => props.theme.colors.backgroundHover};
    transition: background-color 0.1s ease-in;
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.breaker};
  }
`

const PrimaryText = styled.div`
  color: black;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 45%;
`

const SecondaryText = styled.div`
  color: ${props => props.theme.colors.textFaded};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 45%;
`

type CompactListItemProps = {
  primary?: string
  secondary?: string
  to: string
}
export default function CompactListItem({
  primary = '',
  secondary = '',
  to
}: CompactListItemProps) {
  return (
    <Wrapper to={to}>
      <PrimaryText>{primary}</PrimaryText>
      <SecondaryText>{secondary}</SecondaryText>
    </Wrapper>
  )
}
