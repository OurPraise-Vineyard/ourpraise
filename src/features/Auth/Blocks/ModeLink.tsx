import { Link } from 'react-router-dom'
import styled from 'styled-components'

export default styled(Link)`
  font-size: ${props => props.theme.fontSizes.regular};
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
