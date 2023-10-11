import { css, keyframes } from 'styled-components'

import AppTheme from '@styles/AppTheme'

const aligns = {
  center: 'center',
  start: 'flex-start',
  end: 'flex-end',
  stretch: 'stretch'
}

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

export type IBlockBaseProps = {
  margin?: string
  padding?: string
  height?: string
  width?: string
  maxWidth?: string
  maxHeight?: string
  color?: keyof typeof AppTheme.colors
  backgroundColor?: keyof typeof AppTheme.colors
  flex?: 'column' | 'row'
  align?: keyof typeof aligns
  grow?: boolean
  fadeIn?: boolean
  gap?: string
  print?: 'show' | 'hide'
}

function getDisplay(props: IBlockBaseProps, isPrint = false) {
  const display = props.flex ? 'flex' : 'initial'

  if (isPrint) {
    switch (props.print) {
      case 'hide':
        return 'none'
      case 'show':
      default:
        return display
    }
  }

  switch (props.print) {
    case 'show':
      return 'none'
    case 'hide':
    default:
      return display
  }
}

export default css<IBlockBaseProps>`
  margin: ${props => props.margin || ''};
  padding: ${props => props.padding || ''};
  height: ${props => props.height || ''};
  width: ${props => props.width || ''};
  max-width: ${props => props.maxWidth || ''};
  max-height: ${props => props.maxHeight || ''};
  color: ${props => (props.color ? props.theme.colors[props.color] : '')};
  background-color: ${props =>
    props.backgroundColor ? props.theme.colors[props.backgroundColor] : ''};
  display: ${props => getDisplay(props)};
  flex-direction: ${props => props.flex};
  align-items: ${props => (props.align ? aligns[props.align] : 'flex-start')};
  flex: ${props => (props.grow ? '1 0 auto' : '')};
  animation: ${props =>
    props.fadeIn ? `${fadeIn} 0.2s ease-out 0.2s both` : 'none'};
  gap: ${props => props.gap || '0'};

  @media print {
    display: ${props => getDisplay(props, true)};
  }
`
