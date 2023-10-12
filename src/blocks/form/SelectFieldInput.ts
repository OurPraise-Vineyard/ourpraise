import styled from 'styled-components'

export default styled.select<{ $noTitle: boolean }>`
  background: transparent;
  width: 100%;
  display: block;
  border: none;
  font-size: ${props => props.theme.fontSizes.small};
  padding: ${props => (props.$noTitle ? 0 : '8px')} 0 0;
  font-family: 'Oxygen Mono', monospace;

  &:focus {
    border: none;
    outline: none;
  }
`
