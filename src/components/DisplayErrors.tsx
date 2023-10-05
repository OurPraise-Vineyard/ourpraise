import { useAppSelector } from '@hooks/state'
import React from 'react'
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  0% {
    opacity: 0;
    height: 0;
  }

  100% {
    opacity: 1;
    height: 40px;
  }
`

const DisplayError = styled.div<{ unmounted: boolean }>`
  background-color: #f00;
  color: white;
  border-radius: 4px;
  padding: 0 16px;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  opacity: ${props => (props.unmounted ? 0 : 1)};
  height: ${props => (props.unmounted ? '0px' : '40px')};
  transition: all 0.2s ease-out;

  animation: ${fadeIn} 0.2s ease-out;

  z-index: 20000;
`

export default function DisplayErrors () {
  const stack = useAppSelector(state => state.errors.stack)

  return (
    <>
      {stack.map((error, index) => (
        <DisplayError key={error.id} style={{ bottom: index * 48 + 8 }} unmounted={!!error.removed}>
          {error.message}
        </DisplayError>
      ))}
    </>
  )
}
