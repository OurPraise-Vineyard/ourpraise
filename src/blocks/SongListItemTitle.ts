import styled from 'styled-components'

export default styled.div`
  font-size: ${props => props.theme.fontSizes.regular};
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;

  @media print {
    font-size: ${props => props.theme.fontSizes.large};
  }
`
