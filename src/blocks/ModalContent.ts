import styled from 'styled-components'

export default styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  position: relative;
  overflow: auto;
  height: calc(600px - ${props => props.theme.sizes.toolbarHeight} - 20px);
  padding: 20px;
`
