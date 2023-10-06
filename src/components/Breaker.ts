import styled from 'styled-components'

export const Breaker = styled.hr<{ noMargin?: boolean }>`
  border: unset;
  background-color: ${props => props.theme.colors.breaker};
  height: 1px;
  margin: ${props => (props.noMargin ? '-0.5px' : '32px')} 0 -0.5px;
  position: relative;
  z-index: 1;
  display: block;

  @media print {
    display: none;
  }
`
