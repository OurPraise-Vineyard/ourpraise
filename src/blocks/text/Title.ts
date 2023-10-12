import styled from 'styled-components'
import blockBase, { IBlockBaseProps } from 'styles/blockBase'

export default styled.h2<IBlockBaseProps>`
  ${blockBase}
  font-size: ${props => props.theme.fontSizes.large};
  margin: 0;
  flex: 1 0 auto;
`
