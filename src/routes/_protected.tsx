import { Outlet, createFileRoute } from '@tanstack/react-router'

import { requireLoggedIn } from '~/backend/auth'
import Nav from '~/components/Nav'

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
