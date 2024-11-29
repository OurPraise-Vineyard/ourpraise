import Nav from '@components/Nav'

import { requireLoggedIn } from '@backend/auth'
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
