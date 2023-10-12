import { Link, LinkProps } from 'react-router-dom'
import styled, { css } from 'styled-components'

type Props = { $highlight?: boolean }
const wrapperStyles = css<Props>`
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
    props.$highlight ? props.theme.colors.backgroundHover : 'transparent'};
  cursor: pointer;
  color: ${props => props.theme.colors.text};

  &:visited {
    color: ${props => props.theme.colors.text};
  }

  &:hover {
    background-color: ${props => props.theme.colors.backgroundHover};
    transition: background-color 0.1s ease-in;
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.breaker};
  }
`

export const CompactListItemLink = styled(Link)<Props & LinkProps>`
  ${wrapperStyles}
`
export const CompactListItemButton = styled.button<Props>`
  ${wrapperStyles}
`
