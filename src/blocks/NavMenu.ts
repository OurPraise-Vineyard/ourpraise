import styled from 'styled-components'

export default styled.div`
  display: flex;
  grid-area: links;

  > a {
    font-size: ${props => props.theme.fontSizes.small};
    color: ${props => props.theme.colors.navText};
    text-decoration: none;
    margin-right: 20px;
  }
`
