import styled from 'styled-components'

export default styled.ul`
  display: none;
  font-size: ${props => props.theme.fontSizes.regular};
  page-break-after: always;
  padding: 10px 0 10px 40px;
  line-height: 1.5;

  @media print {
    display: block;
  }
`
