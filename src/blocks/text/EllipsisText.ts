import styled from 'styled-components'
import blockBase, { IBlockBaseProps } from 'styles/blockBase'

export default styled.div<IBlockBaseProps>`
  ${blockBase}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
