import styled from 'styled-components'

export default styled.div`
  font-size: ${props => props.theme.fontSizes.regular};
  color: ${props => props.theme.colors.textFaded};
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
  white-space: nowrap;

  @media print {
    font-size: ${props => props.theme.fontSizes.regular};
  }
`
