import { Outlet, createRootRoute } from '@tanstack/react-router'

import { initializeUser } from '~/backend/auth'
import PopUpMenuProvider from '~/components/PopUpMenu'

export const Route = createRootRoute({
  beforeLoad: () => initializeUser(),
  component: () => (
    <PopUpMenuProvider>
      <Outlet />
    </PopUpMenuProvider>
  )
})
