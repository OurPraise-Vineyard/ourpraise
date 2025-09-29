import { StrictMode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'

import router from '~/router'

import { getAuthState } from './backend/auth'
import ErrorPopUpProvider from './components/ErrorPopUp'
import './index.css'

function App() {
  const [showSpinner, setShowSpinner] = useState(false)
  const [isReady, setReady] = useState(false)
  useEffect(() => {
    getAuthState().then(() => setReady(true))
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => setShowSpinner(true), 200)

    return () => clearTimeout(timeout)
  }, [])

  if (!isReady && showSpinner) {
    return (
      <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
        <div className="loading" />
      </div>
    )
  }

  return (
    <ErrorPopUpProvider>
      <RouterProvider router={router} />
    </ErrorPopUpProvider>
  )
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
