import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

export default styled.div<{wide:boolean}>`
  width: ${props => props.wide ? 'auto' : '960px'};
  margin: 0 auto;
  padding: 20px;
  animation: ${fadeIn} .2s ease-out .2s both;
`
