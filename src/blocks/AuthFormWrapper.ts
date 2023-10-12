import styled, { keyframes } from 'styled-components'

import Form from '@blocks/Form'

const transitionIn = keyframes`
  0% {
    top: 20px;
    opacity: 0;
    transform: scaleX(0.97);
  }

  100% {
    top: 0;
    opacity: 1;
    transform: scaleX(1);
  }
`

export default styled(Form)`
  width: 440px;
  max-width: 100vw;
  padding: 20px;
  margin: 20vh auto 0;
  position: relative;
  animation: ${transitionIn} 0.2s ease-out 0.2s both;
`
