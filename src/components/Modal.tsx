import xIcon from 'assets/x.svg'
import Backdrop from 'blocks/Backdrop'
import IconButton from 'blocks/IconButton'
import ModalContainer from 'blocks/ModalContainer'
import ModalContent from 'blocks/ModalContent'
import Toolbar from 'blocks/Toolbar'
import Title from 'blocks/text/Title'
import React, { useEffect } from 'react'

type ModalProps = {
  onClose: () => void
  show: boolean
  children: React.ReactNode
  title?: string
}
export default function Modal({ onClose, show, children, title }: ModalProps) {
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
    <>
      <Backdrop $visible={show} $disabled={!show} onClick={onClose} />
      <ModalContainer $show={show} onClick={handleStopPropagate}>
        <Toolbar $horizontalPadding>
          {!!title && <Title>{title}</Title>}
          <IconButton $edge $icon={xIcon} onClick={onClose} />
        </Toolbar>
        <ModalContent>{children}</ModalContent>
      </ModalContainer>
    </>
  )
}
