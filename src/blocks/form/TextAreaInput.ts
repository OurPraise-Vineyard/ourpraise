import styled from 'styled-components'

const sizes = {
  small: '50px',
  medium: '200px',
  large: '400px'
}

export default styled.textarea<{ $size: keyof typeof sizes }>`
  background: transparent;
  width: 100%;
  display: block;
  border: none;
  font-size: ${props => props.theme.fontSizes.small};
  padding: 8px 0 0;
  font-family: 'Oxygen Mono', monospace;
  min-height: ${props => sizes[props.$size]};
  min-width: 100%;

  &:focus {
    border: none;
    outline: none;
  }
`
