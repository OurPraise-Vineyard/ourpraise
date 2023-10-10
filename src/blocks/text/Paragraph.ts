import styled from 'styled-components'

import blockBase from '@styles/blockBase'

export default styled.p`
  ${blockBase}
  font-size: ${props => props.theme.fontSizes.regular};
  margin: 0 0 8px;
`
