import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Button, { IButtonProps } from '@blocks/Button'

type ToolbarLinkButtonProps = IButtonProps & { to: string }
export default styled(Button).attrs({
  as: Link,
  buttonStyle: 'primary'
})<ToolbarLinkButtonProps>`
  margin: 0;
  text-decoration: none;
  height: ${props => props.theme.sizes.toolbarHeight};
`
