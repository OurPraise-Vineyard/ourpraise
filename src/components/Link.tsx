import { Link } from 'react-router-dom'
import styled from 'styled-components'

export default styled(Link)`
  cursor: pointer;
  color: black;
  text-decoration: none;

  &:visited {
    color: black;
  }

  &:hover {
    text-decoration: underline;
  }
`
