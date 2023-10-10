import styled from 'styled-components'

export default styled.p`
  padding: 0;
  font-size: ${props => props.theme.fontSizes.regular};
  color: ${props => props.theme.colors.navText};
  cursor: pointer;
  grid-area: username;
  justify-self: end;
  margin: 0;
  white-space: nowrap;
  text-align: right;
`
