import styled, { css } from 'styled-components'

const colorSchemes = {
  default: css`
    background: rgb(159,159,159);
    background: linear-gradient(0deg, rgba(159,159,159,1) 0%, rgba(170,170,170,1) 35%, rgba(171,171,171,1) 100%);
    color: white;
  `,
  primary: css`
    background: rgb(87,144,196);
    background: linear-gradient(90deg, #69a0d5 0%, rgba(124,187,244,1) 35%, #91c1ee 100%);
    color: white;
  `,
  danger: css`
    background: rgb(255,0,0);
    background: linear-gradient(98deg, rgba(255,0,0,1) 0%, rgba(227,0,0,1) 35%, rgba(191,0,0,1) 100%);
    color: white;
  `
}

export const buttonBaseHover = css`
  filter: brightness(1.05);
`

export const buttonBase = css<{fullWidth?:boolean;color?:any}>`
  cursor: pointer;
  font-size: 20px;
  transition: all .2s ease-out;
  padding: 10px 20px;
  border-radius: 4px;
  border: 0;
  ${props => colorSchemes[props.color || 'default']}
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
  margin: 0 0 8px;
  display: block;

  width: ${props => props.fullWidth ? '100%' : 'auto'};

  :hover {
    ${buttonBaseHover}
  }
`

export default styled.button`
  ${buttonBase}
`
