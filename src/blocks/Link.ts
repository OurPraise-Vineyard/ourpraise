import { Link } from 'react-router-dom'
import styled from 'styled-components'

export default styled(Link)`
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
