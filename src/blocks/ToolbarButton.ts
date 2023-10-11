import styled from 'styled-components'

import ButtonBase, { IButtonProps } from '@blocks/Button'

export default styled(ButtonBase).attrs({
  buttonStyle: 'primary'
})<IButtonProps>`
  margin: 0;
  text-decoration: none;
  height: ${props => props.theme.sizes.toolbarHeight};
`
