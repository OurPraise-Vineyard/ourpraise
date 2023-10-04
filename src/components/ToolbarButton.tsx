import { buttonBase } from '@components/ButtonBase'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export default styled(Link)`
  ${buttonBase}
  margin: 0;
  text-decoration: none;
`
