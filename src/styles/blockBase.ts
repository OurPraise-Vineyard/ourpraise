import { css } from 'styled-components'

import AppTheme from '@styles/AppTheme'

export type IBlockBaseProps = {
  margin?: string
  padding?: string
  height?: string
  width?: string
  maxWidth?: string
  maxHeight?: string
  color?: keyof typeof AppTheme.colors
  backgroundColor?: keyof typeof AppTheme.colors
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
`
