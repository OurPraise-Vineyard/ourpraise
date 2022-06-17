import { Link } from 'react-router-dom'
import styled from 'styled-components'

export default styled(Link)`
  font-size: 20px;
  color: white;
  display: block;
  text-align: center;
  margin: 20px 0;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:visited {
    color: white;
  }
`
