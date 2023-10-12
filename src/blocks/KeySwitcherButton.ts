import checked from 'assets/check-square.svg'
import decrease from 'assets/decrease.svg'
import increase from 'assets/increase.svg'
import reset from 'assets/reset.svg'
import unchecked from 'assets/square.svg'
import styled from 'styled-components'

const icons = {
  increase,
  decrease,
  reset,
  checked,
  unchecked
}

export default styled.button.attrs({ tabIndex: -1 })<{
  icon: keyof typeof icons
}>`
  background-image: url(${props => icons[props.icon]});
  background-size: 90% 90%;
  background-position: center;
  background-color: transparent;
  border: none;
  width: 20px;
  height: 20px;
  flex: 0 1 auto;
  border-radius: 50%;
  transition: all 0.2s ease-out;
  padding: 5px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:not(:disabled):hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  &:focus {
    border: 0;
    outline: 0;
  }
`
