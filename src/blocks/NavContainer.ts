import styled from 'styled-components'

export default styled.nav`
  background-color: ${props => props.theme.colors.navBackground};
  box-shadow: ${props => props.theme.boxShadow};

  @media print {
    display: none;
  }
`
