import classNames from 'classnames'
import { useEffect } from 'react'
import * as React from 'react'
import xIcon from '~/assets/x.svg'
import { pageTitleStyles, toolbarStyles } from '~/common-styles'
import IconButton from '~/components/IconButton'

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
      <div
        className={classNames(
          'fixed bottom-0 left-0 right-0 top-0 z-20 bg-black bg-opacity-10 transition-opacity duration-200 ease-out',
          {
            'pointer-events-none opacity-0': !show,
            'pointer-events-all opacity-100': show
          }
        )}
        onClick={onClose}
      />
      <div
        className={classNames(
          'fixed left-1/2 z-40 flex h-modal w-modal max-w-modal -translate-x-1/2 flex-col rounded-md bg-white shadow-md transition-all duration-200 ease-out',
          {
            'translate-y-5': !show,
            'pointer-events-none': !show,
            'opacity-0': !show
          }
        )}
        onClick={handleStopPropagate}
      >
        <div className={classNames(toolbarStyles, 'px-5')}>
          {!!title && <p className={pageTitleStyles}>{title}</p>}
          <IconButton icon={xIcon} onClick={onClose} />
        </div>
        <div className="relative flex flex-grow flex-col p-5">{children}</div>
      </div>
    </>
  )
}
