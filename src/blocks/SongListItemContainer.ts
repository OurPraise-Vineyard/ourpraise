import styled from 'styled-components'

export default styled.div`
  margin: 32px 0;

  @media print {
    padding: 0;
    box-shadow: none;
    &:not(:last-child) {
      page-break-after: always;
    }
  }

  @media screen {
    padding-bottom: 32px;
    border-bottom: 1px solid ${props => props.theme.colors.breaker};
  }
`
