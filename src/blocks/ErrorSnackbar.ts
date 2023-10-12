import FadeIn from 'blocks/FadeIn'
import styled from 'styled-components'

export default styled(FadeIn)<{ unmounted: boolean }>`
  background-color: #f00;
  color: white;
  border-radius: 4px;
  padding: 0 16px;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  opacity: ${props => (props.unmounted ? 0 : 1)};
  height: ${props => (props.unmounted ? '0px' : '40px')};
  transition: all 0.2s ease-out;

  z-index: ${props => props.theme.zIndex.errors};
`
