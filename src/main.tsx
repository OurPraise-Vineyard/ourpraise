import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import router from '~/router'
import store from '~/state/store'

import { RouterProvider } from '@tanstack/react-router'

// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import './index.css'

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
        {/* <TanStackRouterDevtools router={router} /> */}
      </Provider>
    </StrictMode>
  )
}
