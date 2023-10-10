import styled from 'styled-components'

export default styled.div`
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: row;
  padding: 8px;
  align-items: center;
  height: ${props => props.theme.sizes.toolbarHeight};
`
