import AppTheme from '@styles/AppTheme'
import styled from 'styled-components'

export default styled.button<{ icon }>`
  background-color: transparent;
  background-image: url(${props => props.icon});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px 20px;
  border: 0;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  transition: background-color .2s ease-out;
  cursor: pointer;

  &:hover {
    background-color: ${AppTheme.colors.backgroundHover};
  }
`
