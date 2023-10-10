import styled from 'styled-components'

export default styled.select`
  font-size: ${props => props.theme.fontSizes.regular};
  flex: 1 0 auto;
  background: transparent;
  border: 0;
  appearance: none;
  margin: 0 5px;
  text-align: right;
  transition: all 0.2s ease-out;

  &:disabled {
    opacity: 0.5;
  }

  &:focus {
    border: 0;
    outline: 0;
  }
`
