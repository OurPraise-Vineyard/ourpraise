import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { getAuthState } from '~/backend/auth'
import Nav from '~/components/Nav'
import Page from '~/components/Page'

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
    <main>
      <Nav />
      <Outlet />
    </main>
  ),
  notFoundComponent: () => (
    <main>
      <Nav />
      <Page className="pt-9">
        <h1 className="text-title mb-2 font-bold">
          Could not find what you're looking for.
        </h1>
        <p className="text-lg">The requested page or items was not found.</p>
      </Page>
    </main>
  )
})
