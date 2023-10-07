import React from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

const wrapperStyles = css<{ highlight?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${props => props.theme.fontSizes.regular};
  text-decoration: none;
  padding: 6px 0;
  border-radius: 4px;
  transition: background-color 0.2s ease-in;
  position: relative;
  z-index: 2;
  border: 0;
  background-color: ${props =>
    props.highlight ? props.theme.colors.backgroundHover : 'transparent'};
  cursor: pointer;

  :hover {
    background-color: ${props => props.theme.colors.backgroundHover};
    transition: background-color 0.1s ease-in;
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.breaker};
  }
`

const WrapperLink = styled(Link)`
  ${wrapperStyles}
`
const WrapperButton = styled.button`
  ${wrapperStyles}
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
  to?: string
  onClick?: React.MouseEventHandler
  highlight?: boolean
}
export default function CompactListItem({
  primary = '',
  secondary = '',
  to,
  onClick,
  highlight
}: CompactListItemProps) {
  if (to) {
    return (
      <WrapperLink highlight={highlight} to={to}>
        <PrimaryText>{primary}</PrimaryText>
        <SecondaryText>{secondary}</SecondaryText>
      </WrapperLink>
    )
  } else if (onClick) {
    return (
      <WrapperButton highlight={highlight} onClick={onClick}>
        <PrimaryText>{primary}</PrimaryText>
        <SecondaryText>{secondary}</SecondaryText>
      </WrapperButton>
    )
  }
  return <></>
}
