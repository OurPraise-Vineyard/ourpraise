import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { getAuthState } from '~/backend/auth'
import Nav from '~/components/Nav'

export const Route = createFileRoute('/_protected')({
  beforeLoad: () => {
    const authState = getAuthState()

    if (authState.status !== 'loggedIn') {
      throw redirect({
        to: '/login',
        search: {
          redirect: window.location.pathname
        }
      })
    }
  },
  component: () => (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
    </>
  )
})
