import { initializeUser } from '@backend/auth'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  beforeLoad: () => initializeUser(),
  component: () => <Outlet />
})
