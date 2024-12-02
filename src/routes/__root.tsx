import { Outlet, createRootRoute } from '@tanstack/react-router'

import { initializeUser } from '~/backend/auth'
import ErrorPopUpProvider from '~/components/ErrorPopUp'
import Loading from '~/components/Loading'
import Nav from '~/components/Nav'
import NotFoundPage from '~/components/NotFound'
import Page from '~/components/Page'
import PopUpMenuProvider from '~/components/PopUpMenu'

function RootComponent({ children }: { children: React.ReactNode }) {
  return (
    <PopUpMenuProvider>
      <ErrorPopUpProvider>{children}</ErrorPopUpProvider>
    </PopUpMenuProvider>
  )
}

export const Route = createRootRoute({
  beforeLoad: () => initializeUser(),
  component: () => (
    <RootComponent>
      <Outlet />
    </RootComponent>
  ),
  notFoundComponent: () => (
    <RootComponent>
      <Nav />
      <NotFoundPage />
    </RootComponent>
  ),
  errorComponent: ({ error }) => (
    <RootComponent>
      <main>
        <Nav />
        <Page className="pt-9">
          <h1 className="mb-2 text-title font-bold">
            An error occured while loading the page
          </h1>
          <p className="text-lg">{error.message}</p>
        </Page>
      </main>
    </RootComponent>
  ),
  pendingComponent: () => <Loading fullscreen />,
  wrapInSuspense: true
})
