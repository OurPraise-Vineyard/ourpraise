import styled, { css } from 'styled-components'

export default styled.div<{ $fullscreen?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;

  ${props =>
    props.$fullscreen &&
    css`
      position: absolute;
      height: 100vh;
      left: 0;
      top: 0;
    `}
`
