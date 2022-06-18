import React, { useEffect } from 'react'
import styled from 'styled-components'
import { css } from 'styled-components'
import xIcon from '@assets/x.svg'

const Grid = styled.div<{ show: boolean, narrow: boolean }>`
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  overflow-y: auto;
  transition: opacity 0.2s ease-out, grid-template-columns 0.5s ease-out;
  padding: 60px;

  ${props =>
    !props.show &&
    css`
      opacity: 0;
      pointer-events: none;
    `}
`

const ModalContainer = styled.div<{ show: boolean, narrow: boolean }>`
  position: fixed;
  z-index: 10001;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => props.narrow ? '400px' : '800px'};
  max-width: 90vw;
  height: 600px;
  background-color: white;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: top 0.2s ease-out, width .2s ease-out;
  display: flex;
  flex-direction: column;

  ${props =>
    !props.show &&
    css`
      top: calc(50% + 20px);
      transition: top 0.2s ease-out;
      pointer-events: none;
    `}
`

const ModalContent = styled.div<{ blank: boolean }>`
  padding: ${props => props.blank ? 0 : '20px'};
  flex: 1 0 auto;
  position: relative;
`

const Toolbar = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 20px 20px 0;
  flex: 0 1 auto;
`

const Title = styled.div`
  font-size: 20px;
  flex: 1 0 auto;
`

const CloseButton = styled.button`
  background: url(${xIcon});
  width: 20px;
  height: 20px;
  border: 0;
  cursor: pointer;
`

export default function Modal ({
  onClose = () => null,
  show = false,
  children = undefined,
  title = undefined,
  narrow = false,
  blank = false
}) {
  useEffect(
    function () {
      if (show) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    },
    [show]
  )

  function handleStopPropagate(e) {
    e.stopPropagation()
  }

  return (
    <Grid show={show} narrow={narrow} onClick={onClose}>
      <ModalContainer show={show} narrow={narrow} onClick={handleStopPropagate}>
        {(!blank && !!title) && (
          <Toolbar>
            {!!title && <Title>{title}</Title>}
            {!blank && <CloseButton onClick={onClose} />}
          </Toolbar>
        )}
        <ModalContent blank={blank}>{children}</ModalContent>
      </ModalContainer>
    </Grid>
  )
}
