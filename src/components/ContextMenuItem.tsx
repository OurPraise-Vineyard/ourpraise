import styled from 'styled-components'

export default styled.button`
  background-color: ${props => props.theme.colors.background};
  padding: 0 20px;
  border: 0;
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.default};
  height: ${props => props.theme.sizes.contextMenuItemHeight}px;
  font-size: ${props => props.theme.fontSizes.small};

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.breaker};
  }

  &:hover {
    background-color: ${props => props.theme.colors.backgroundHover};
  }
`
