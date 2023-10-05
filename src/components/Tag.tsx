import styled from 'styled-components'

export default styled.span`
  padding: 4px 8px;
  background-color: ${props => props.theme.colors.chipBackground};
  color: black;
  border-radius: 4px;
  font-size: 16px;
  flex: 0 0 auto;

  @media print {
    color: ${props => props.theme.colors.textFaded};
    background-color: transparent;
    font-size: 22px;
    padding: 0;
  }
`
