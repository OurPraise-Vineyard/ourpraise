import styled, { css } from 'styled-components'
import blockBase, { IBlockBaseProps } from 'styles/blockBase'

const colorSchemes = {
  default: css`
    background: #f0f0f0;
    color: black;
    border: 1px solid #dedede;
  `,
  primary: css`
    background: ${props => props.theme.colors.ctaPrimary};
    color: white;
    border: 1px solid #689dcf;
  `,
  danger: css`
    background: ${props => props.theme.colors.ctaDanger};
    color: white;
    border: 1px solid #e30000;
  `,
  transparent: css`
    background: transparent;
    border: 1px solid black;
    color: black;
  `
}

export type IButtonProps = IBlockBaseProps & {
  buttonStyle?: keyof typeof colorSchemes
}

export default styled.button<IButtonProps>`
  ${blockBase}
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.regular};
  transition: all 0.2s ease-out;
  padding: 10px 20px;
  border-radius: 4px;
  border: 0;
  margin: 0 0 8px;
  display: block;
  ${props => colorSchemes[props.buttonStyle || 'default']}

  :hover {
    filter: brightness(1.05);
  }
`
