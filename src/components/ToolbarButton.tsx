import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { buttonBase } from '@components/ButtonBase'

export default styled(Link)`
  ${buttonBase}
  margin: 0;
  text-decoration: none;
`
