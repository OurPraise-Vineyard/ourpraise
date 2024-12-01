import { Outlet, createRootRoute } from '@tanstack/react-router'

import { initializeUser } from '~/backend/auth'

export const Route = createRootRoute({
  beforeLoad: () => initializeUser(),
  component: () => <Outlet />
})
