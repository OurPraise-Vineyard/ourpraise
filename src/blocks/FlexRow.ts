import styled from 'styled-components'

import blockBase, { IBlockBaseProps } from '@styles/blockBase'

type FlexRowProps = { centered?: boolean; gap?: boolean } & IBlockBaseProps
export default styled.div<FlexRowProps>`
  ${blockBase}
  display: flex;
  flex-direction: row;
  align-items: ${props => (props.centered ? 'center' : 'flex-start')};
  gap: ${props => (props.gap ? '12px' : '0px')};
`
