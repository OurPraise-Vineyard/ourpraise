// Here we override the default theme of "styled-components", to enable code hinting.
type Theme = typeof AppTheme
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}

const AppTheme = {
  colors: {
    background: '#fff',
    text: '#000',
    textFaded: '#aaa',
    navBackground: '#000',
    navText: '#fff',
    navTextFaded: '#bbb',
    backgroundHover: '#ebebeb',
    border: '#aaa',
    subtleInput: '#efefef',
    subtleButtonBackground: '#efefef',
    subtleButtonBorder: '#ddd'
  },

  fontWeights: {
    regular: 400,
    bold: 500
  },

  fontSizes: {
    regular: 16
  },

  fontStack: 'Abel, sans-serif',
  boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.2)'
}

export default AppTheme
