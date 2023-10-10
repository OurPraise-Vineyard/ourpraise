import styled from 'styled-components'

export default styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 8px;

  @media print {
    padding-bottom: 4px;
    border-bottom: 1px solid ${props => props.theme.colors.breaker};
  }
`
