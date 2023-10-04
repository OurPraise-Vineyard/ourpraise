import styled, { css, keyframes } from 'styled-components'

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

export default styled.div<{noFadeIn?:boolean}>`
  width: 960px;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  ${props => !props.noFadeIn && css`animation: ${fadeIn} .2s ease-out .2s both`};
`
