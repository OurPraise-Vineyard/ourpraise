import styled from 'styled-components'

export default styled.div`
  padding: 10px 15px;
  border-radius: 22px;
  background-color: ${props => props.theme.colors.subtleButtonBackground};
  position: relative;
  border: 1px solid ${props => props.theme.colors.subtleButtonBorder};
  font-size: ${props => props.theme.fontSizes.small};
`
