import styled from 'styled-components'

export default styled.div<{ centered?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: ${props => (props.centered ? 'center' : 'flex-start')};
`
