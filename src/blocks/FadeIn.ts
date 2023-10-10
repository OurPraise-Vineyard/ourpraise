import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

export default styled.div`
  animation: ${fadeIn} 0.2s ease-out 0.2s both;
`
