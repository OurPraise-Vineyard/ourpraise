import styled from 'styled-components'

export default styled.div`
  background-color: ${props => props.theme.colors.breaker};
  width: 1px;
  display: block;
  height: calc(${props => props.theme.sizes.toolbarHeight} * 0.8);
`
