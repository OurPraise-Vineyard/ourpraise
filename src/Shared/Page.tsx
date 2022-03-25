import styled from 'styled-components'

export default styled.div<{wide:boolean}>`
  width: ${props => props.wide ? 'auto' : '960px'};
  margin: 0 auto;
  padding: 20px;
`
