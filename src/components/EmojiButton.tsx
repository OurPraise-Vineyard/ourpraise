import styled from 'styled-components'
import ButtonBase, { buttonBaseHover } from '@components/ButtonBase'

export default styled(ButtonBase)<{ emoji: any }>`
  width: 100%;
  overflow: hidden;
  position: relative;

  &:before {
    content: ${props => `"${props.emoji}"`};
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 10px;
    left: 0px;
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 25px;
    transition: all 0.2s ease-out;
    opacity: 0;
  }

  :hover {
    ${buttonBaseHover}
    color: transparent;

    &:before {
      top: 0;
      color: white;
      opacity: 1;
    }
  }
`
