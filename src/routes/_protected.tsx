import { requireLoggedIn } from '~/backend/auth'
import Nav from '~/components/Nav'

import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  beforeLoad: requireLoggedIn,
  component: Layout
})

function Layout() {
  return (
    <main>
      <Nav />
      <Outlet />
    </main>
  )
}
