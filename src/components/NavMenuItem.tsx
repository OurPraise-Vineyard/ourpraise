import { NavLink } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

const itemAnimation = keyframes`
  0% {
    left: 0;
    right: 100%;
  }

  100% {
    left: 0;
    right: 0;
  }
`

export default styled(NavLink)`
  position: relative;
  color: white;

  ::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 100%;
    right: 0;
    background-color: white;
    height: 1px;
    transition: left 0.2s linear, right 0.2s linear;
  }

  :hover {
    ::before {
      animation: ${itemAnimation} 0.2s;
      right: 0;
      left: 0;
    }
  }

  &.active {
    ::before {
      left: 0;
      animation: ${itemAnimation} 0.2s;
    }
  }
`
