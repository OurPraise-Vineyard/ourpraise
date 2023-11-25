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
    backgroundHover: '#f5f5f5',
    border: '#aaa',
    subtleInput: '#efefef',
    subtleButtonBackground: '#efefef',
    subtleButtonBorder: '#ddd',
    breaker: '#ddd',
    chipBackground: '#e0e0e0',
    ctaPrimary: '#6fa7db',
    ctaDanger: '#ff0000'
  },

  fontWeights: {
    regular: 400,
    bold: 500
  },

  fontSizes: {
    small: '16px',
    regular: '20px',
    large: '24px'
  },

  fontStack: 'Abel, sans-serif',
  boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.2)',

  sizes: {
    toolbarHeight: '50px',
    contextMenuWidth: 150,
    contextMenuItemHeight: 40,
    pageWidth: '960px'
  },

  zIndex: {
    contextMenu: 1000,
    contextMenuBackdrop: 999,
    errors: 2000,
    modal: 1500,
    modalBackdrop: 1499
  },

  transitions: {
    default: '.2s ease-out'
  }
}

export default AppTheme
