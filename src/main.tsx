import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'

import router from '~/router'

import ErrorPopUpProvider from './components/ErrorPopUp'
import './index.css'

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ErrorPopUpProvider>
        <RouterProvider router={router} />
      </ErrorPopUpProvider>
    </StrictMode>
  )
}
