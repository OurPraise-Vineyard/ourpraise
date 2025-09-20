import { isRouteErrorResponse, useRouteError } from 'react-router'

import Nav from '~/components/Nav'
import Page from '~/components/Page'

export function ErrorBoundary() {
  const error = useRouteError() as any
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error?.message || 'An unexpected error occurred'
  return (
    <main>
      <Nav />
      <Page className="pt-9">
        <h1 className="text-title mb-2 font-bold">
          An error occurred while loading the page
        </h1>
        <p className="text-lg">Error: {message}</p>
      </Page>
    </main>
  )
}
