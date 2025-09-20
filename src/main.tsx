import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'

import router from '~/router'

import ErrorPopUpProvider from './components/ErrorPopUp'
import PopUpMenuProvider from './components/PopUpMenu'
import './index.css'

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <PopUpMenuProvider>
        <ErrorPopUpProvider>
          <RouterProvider router={router} />
        </ErrorPopUpProvider>
      </PopUpMenuProvider>
    </StrictMode>
  )
}
