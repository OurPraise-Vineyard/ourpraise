import styled from 'styled-components'

export default styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: ${props => props.theme.zIndex.backdrop};
`
