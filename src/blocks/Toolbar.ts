import styled from 'styled-components'

export default styled.div<{
  extraSpacingTop?: boolean
  horizontalPadding?: boolean
}>`
  display: flex;
  margin: ${props => (props.extraSpacingTop ? '24px' : '0')} 0 0;
  padding: 8px ${props => (props.horizontalPadding ? '20px' : '0')};
  align-items: center;
  justify-content: flex-end;
  height: calc(${props => props.theme.sizes.toolbarHeight} + 16px);
  border-bottom: 1px solid ${props => props.theme.colors.breaker};
  gap: 16px;

  @media print {
    padding: 0;
    height: ${props => props.theme.sizes.toolbarHeight};
  }
`
