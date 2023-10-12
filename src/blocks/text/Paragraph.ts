import styled from 'styled-components'
import blockBase, { IBlockBaseProps } from 'styles/blockBase'

export default styled.p<IBlockBaseProps>`
  ${blockBase}
  font-size: ${props => props.theme.fontSizes.regular};
  margin: 0 0 8px;
`
