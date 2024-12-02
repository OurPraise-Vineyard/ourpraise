import { createFileRoute, redirect } from '@tanstack/react-router'

import { getAuthState } from '~/backend/auth'
import Login, { validateSearch } from '~/pages/LoginPage'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ location, search }) => {
    const authState = getAuthState()
    if (location.pathname === '/login' && authState.status === 'loggedIn') {
      throw redirect({
        to: search.redirect || '/events'
      })
    }
  },
  validateSearch: validateSearch,
  component: () => <Login routePath="/login" />
})
