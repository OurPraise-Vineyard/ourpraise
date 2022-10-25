import styled from 'styled-components'

export const Breaker = styled.hr`
  border: unset;
  background-color: ${props => props.theme.colors.backgroundOffset};
  height: 1px;
  margin: -0.5px 0;
  position: relative;
  z-index: 1;
  display: block;
`
