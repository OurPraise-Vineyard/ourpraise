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
  gap: 16px;
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

export const CompactListItemLink = styled(Link)`
  ${wrapperStyles}
`
export const CompactListItemButton = styled.button`
  ${wrapperStyles}
`
