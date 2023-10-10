import styled from 'styled-components'

import blockBase from '@styles/blockBase'

export default styled.div`
  ${blockBase}
  font-family: 'Oxygen Mono', monospace;
  white-space: pre;
  font-size: ${props => props.theme.fontSizes.small};
`
