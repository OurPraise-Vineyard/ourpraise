import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-family: ${props => props.theme.fontStack};
    font-size: ${props => props.theme.fontSizes.regular};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  button, input, select {
    font-family: ${props => props.theme.fontStack};
    font-size: ${props => props.theme.fontSizes.regular};
  }
`

export default GlobalStyle
