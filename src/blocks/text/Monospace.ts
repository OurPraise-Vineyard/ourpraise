import styled from 'styled-components'
import blockBase, { IBlockBaseProps } from 'styles/blockBase'

export default styled.div<IBlockBaseProps>`
  ${blockBase}
  font-family: 'Oxygen Mono', monospace;
  white-space: pre;
  font-size: ${props => props.theme.fontSizes.small};
`
