import { createContext, useContext, useState } from 'react'

import Modal from './Modal'

type ErrorPopUpContextType = {
  show: (message: string) => void
}

const ErrorPopUpContext = createContext<ErrorPopUpContextType>({
  show: () => {}
})

export const useErrorPopUp = () => useContext(ErrorPopUpContext)

export default function ErrorPopUpProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState('')

  const open = (message: string | Error) => {
    if (message instanceof Error) {
      message = message.message
    }
    setMessage(message)
    setShow(true)
  }

  const close = () => setShow(false)

  return (
    <>
      <Modal show={show} onClose={close} title="An error occurred">
        <p className="grow text-lg text-red-500">{message}</p>
        <button onClick={close} className="btn btn-primary">
          Close
        </button>
      </Modal>
      <ErrorPopUpContext.Provider value={{ show: open }}>
        {children}
      </ErrorPopUpContext.Provider>
    </>
  )
}
