import classNames from 'classnames'
import { ReactNode, useEffect } from 'react'
import { MouseEvent } from 'react'

import xIcon from '~/assets/x.svg'
import IconButton from '~/components/IconButton'

type ModalProps = {
  onClose: () => void
  show: boolean
  children: ReactNode
  title?: string
}
export default function Modal({ onClose, show, children, title }: ModalProps) {
  function handleStopPropagate(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
  }

  return (
    <>
      <div
        className={classNames(
          'fixed bottom-0 left-0 right-0 top-0 z-20 hidden bg-black bg-opacity-30 transition-opacity duration-200 ease-out sm:block',
          {
            'pointer-events-none opacity-0': !show,
            'pointer-events-all opacity-100': show
          }
        )}
        onClick={onClose}
      />
      <div
        className={classNames(
          'fixed left-0 top-0 z-40 flex h-screen w-screen flex-col bg-white transition-all duration-200 ease-out sm:left-1/2 sm:top-20 sm:h-modal sm:w-modal sm:max-w-modal sm:-translate-x-1/2 sm:rounded-md sm:shadow-md',
          {
            'translate-y-5': !show,
            'pointer-events-none': !show,
            'opacity-0': !show
          }
        )}
        onClick={handleStopPropagate}
      >
        <div className="flex items-center gap-4 border-b border-b-gray-300 px-5 py-4">
          {!!title && <p className="text-title flex-grow font-bold">{title}</p>}
          <IconButton icon={xIcon} onClick={onClose} />
        </div>
        <div className="relative flex flex-grow flex-col p-5">{children}</div>
      </div>
    </>
  )
}
