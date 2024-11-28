import { pageTitleStyles, toolbarStyles } from '@common-styles'
import React, { useEffect } from 'react'

import IconButton from '@components/IconButton'

import Backdrop from '@blocks/Backdrop'
import ModalContainer from '@blocks/ModalContainer'
import ModalContent from '@blocks/ModalContent'

import xIcon from '@assets/x.svg'

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
        <div className={toolbarStyles}>
          {!!title && <p className={pageTitleStyles}>{title}</p>}
          <IconButton edge icon={xIcon} onClick={onClose} />
        </div>
        <ModalContent>{children}</ModalContent>
      </ModalContainer>
    </>
  )
}
