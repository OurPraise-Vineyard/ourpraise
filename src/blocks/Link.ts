import { Link } from 'react-router-dom'
import styled from 'styled-components'

import blockBase from '@styles/blockBase'

export default styled(Link)`
  ${blockBase}
  cursor: pointer;
  color: ${props => props.color || 'black'};
  text-decoration: none;

  &:visited {
    color: ${props => props.color || 'black'};
  }

  &:hover {
    text-decoration: underline;
  }
`
