import { createContext, useContext, useRef, useState } from 'react'

import alertIcon from '~/assets/alert-circle.svg'

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
  const timeout = useRef<number>(0)

  const open = (message: string | Error) => {
    if (message instanceof Error) {
      message = message.message
    }
    console.error(`An error occurred: ${message}`)
    setMessage(message)
    setShow(true)

    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    timeout.current = setTimeout(() => setShow(false), 5000)
  }

  return (
    <>
      {show && (
        <div
          role="alert"
          className="alert alert-error animate-teleportIn fixed bottom-4 left-1/2 w-96 max-w-full -translate-x-1/2"
        >
          <img src={alertIcon} className="icon" />
          <span>An error occurred: {message}</span>
        </div>
      )}
      <ErrorPopUpContext.Provider value={{ show: open }}>
        {children}
      </ErrorPopUpContext.Provider>
    </>
  )
}
