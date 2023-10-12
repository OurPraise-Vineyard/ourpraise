import styled from 'styled-components'

export default styled.div<{ $top: number; $left: number }>`
  position: fixed;
  z-index: ${props => props.theme.zIndex.contextMenu};
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: ${props => props.theme.sizes.contextMenuWidth}px;
  box-shadow: ${props => props.theme.boxShadow};
  border-radius: 4px;
  overflow: hidden;
`
