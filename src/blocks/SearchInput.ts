import styled from 'styled-components'

export default styled.input`
  font-size: ${props => props.theme.fontSizes.regular};
  border: none;
  flex: 1 0 auto;
  width: 122px;

  &:focus {
    outline: none;
    border: none;
  }
`
