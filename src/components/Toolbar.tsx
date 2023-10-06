import styled from 'styled-components'

export default styled.div<{ extraSpacingTop?: boolean }>`
  display: flex;
  margin: ${props => (props.extraSpacingTop ? '32px' : '8px')} 0 0;
  padding-bottom: 8px;
  align-items: center;
  justify-content: flex-end;
  height: calc(${props => props.theme.sizes.toolbarHeight} + 8px);
  border-bottom: 1px solid ${props => props.theme.colors.breaker};

  & > *:not(:last-child) {
    margin-right: 16px;
  }
`
