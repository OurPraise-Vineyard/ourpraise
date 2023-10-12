import styled from 'styled-components'

export default styled.div<{ $show: boolean }>`
  position: fixed;
  z-index: ${props => props.theme.zIndex.modal};
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  max-width: 90vw;
  height: 600px;
  background-color: white;
  box-shadow: ${props => props.theme.boxShadow};
  border-radius: 4px;
  transition:
    top 0.2s ease-out,
    opacity 0.2s ease-out;
  display: flex;
  flex-direction: column;

  opacity: ${props => (props.$show ? 1 : 0)};
  top: ${props => (props.$show ? '50%' : 'calc(50% + 20px)')};
  pointer-events: ${props => (props.$show ? 'all' : 'none')};
`
