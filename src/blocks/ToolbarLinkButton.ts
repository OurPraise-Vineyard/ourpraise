import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { buttonBase } from '@blocks/ButtonBase'

export default styled(Link).attrs({
  color: 'primary'
})`
  ${buttonBase}
  margin: 0;
  text-decoration: none;
  height: ${props => props.theme.sizes.toolbarHeight};
`
