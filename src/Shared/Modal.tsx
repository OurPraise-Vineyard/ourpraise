import React, { useEffect } from 'react'
import styled from 'styled-components'
import { css } from 'styled-components'
import xIcon from 'assets/x.svg'

const Grid = styled.div<{show?:boolean}>`
  background-color: rgba(0, 0, 0, 0.2);
  display: grid;
  grid-template-columns: 1fr minmax(auto, 800px) 1fr;
  grid-template-rows: 1fr min-content 1fr;
  grid-template-areas: ". . ." ". modal ." ". . .";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  overflow-y: auto;
  transition: opacity 0.2s ease-out;
  padding: 60px;

  ${props => !props.show && css`
    opacity: 0;
    pointer-events: none;
  `}
`

const ModalContainer = styled.div<{show?:boolean}>`
  grid-area: modal;
  min-height: 600px;
  background-color: white;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: top 0.2s ease-out;
  top: 0;
  position: relative;

  ${props => !props.show && css`
    top: 20px;
  `}
`

const ModalContent = styled.div`
  padding: 20px;
`

const Toolbar = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 20px 20px 0;
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

export default function Modal ({ onClose = () => null, show = false, children = undefined, title = undefined, hideX = false }) {
  useEffect(function () {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [show])

  function handleStopPropagate (e) {
    e.stopPropagation()
  }

  return (
    <Grid show={show} onClick={onClose}>
      <ModalContainer show={show} onClick={handleStopPropagate}>
        <Toolbar>
          {!!title && <Title>{title}</Title>}
          {!hideX && <CloseButton onClick={onClose} />}
        </Toolbar>
        <ModalContent>
          {children}
        </ModalContent>
      </ModalContainer>
    </Grid>
  )
}
