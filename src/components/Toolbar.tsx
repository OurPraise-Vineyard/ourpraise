import styled from 'styled-components'

export default styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: stretch;
  margin: 0 0 16px;
  justify-content: flex-end;

  & > *:not(:last-child) {
    margin-right: 16px;
  }
`
