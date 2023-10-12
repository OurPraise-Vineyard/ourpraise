import styled from 'styled-components'

export default styled.div<{ $visible?: boolean; $disabled?: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: ${props => props.theme.zIndex.contextMenuBackdrop};
  background-color: rgba(0, 0, 0, 0.2);
  transition: opacity 0.2s ease-out;

  opacity: ${props => (props.$visible ? 1 : 0)};
  pointer-events: ${props => (props.$disabled ? 'none' : 'all')};
`
