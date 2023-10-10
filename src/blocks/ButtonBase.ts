import styled, { css } from 'styled-components'

const colorSchemes = {
  default: css`
    background: #f0f0f0;
    color: black;
    border: 1px solid #dedede;
  `,
  primary: css`
    background: #6fa7db;
    color: white;
    border: 1px solid #689dcf;
  `,
  danger: css`
    background: #ff0000;
    color: white;
    border: 1px solid #e30000;
  `,
  transparent: css`
    background: transparent;
    border: 1px solid black;
    color: black;
  `
}

export const buttonBaseHover = css`
  filter: brightness(1.05);
`

export const buttonBase = css<{
  fullWidth?: boolean
  color?: keyof typeof colorSchemes
  width?: string
}>`
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.regular};
  transition: all 0.2s ease-out;
  padding: 10px 20px;
  border-radius: 4px;
  border: 0;
  margin: 0 0 8px;
  display: block;
  ${props => colorSchemes[props.color || 'default']}

  width: ${props => props.width || (props.fullWidth ? '100%' : 'auto')};

  :hover {
    ${buttonBaseHover}
  }
`

export default styled.button`
  ${buttonBase}
`
