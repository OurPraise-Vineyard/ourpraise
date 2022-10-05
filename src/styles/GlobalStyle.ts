import { createGlobalStyle } from 'styled-components'
import AppTheme from './AppTheme'

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${AppTheme.colors.background};
    color: ${AppTheme.colors.text};
    font-family: ${AppTheme.fontStack};
    font-size: ${AppTheme.fontSizes.regular};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  button, input, select {
    font-family: ${AppTheme.fontStack};
    font-size: ${AppTheme.fontSizes.regular};
  }
`

export default GlobalStyle
