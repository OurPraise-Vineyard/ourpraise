import { Outlet, createRootRoute } from '@tanstack/react-router'

import { initializeUser } from '~/backend/auth'
import ErrorPopUpProvider from '~/components/ErrorPopUp'
import Nav from '~/components/Nav'
import Page from '~/components/Page'
import PopUpMenuProvider from '~/components/PopUpMenu'

export const Route = createRootRoute({
  beforeLoad: () => initializeUser(),
  component: () => (
    <PopUpMenuProvider>
      <ErrorPopUpProvider>
        <Outlet />
      </ErrorPopUpProvider>
    </PopUpMenuProvider>
  ),
  notFoundComponent: () => (
    <main>
      <Nav />
      <Page className="pt-9">
        <h1 className="mb-2 text-title font-bold">
          Could not find what you're looking for.
        </h1>
        <p className="text-lg">The requested page or items was not found.</p>
      </Page>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main>
      <Nav />
      <Page className="pt-9">
        <h1 className="mb-2 text-title font-bold">
          An error occured while loading the page
        </h1>
        <p className="text-lg">{error.message}</p>
      </Page>
    </main>
  ),
  pendingComponent: () => (
    <p className="flex h-screen items-center justify-center">
      Loading OurPraise...
    </p>
  ),
  wrapInSuspense: true
})
