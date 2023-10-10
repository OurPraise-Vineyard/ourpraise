import styled from 'styled-components'

export default styled.input`
  background: transparent;
  width: 100%;
  display: block;
  border: none;
  font-size: ${props => props.theme.fontSizes.small};
  padding: 8px 0 0;
  font-family: 'Oxygen Mono', monospace;

  &:focus {
    border: none;
    outline: none;
  }
`
