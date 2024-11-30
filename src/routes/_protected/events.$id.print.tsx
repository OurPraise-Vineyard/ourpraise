import { createFileRoute } from '@tanstack/react-router'

import { requireLoggedIn } from '~/backend/auth'
import PrintEventPage, { loader } from '~/pages/Event/Print'

export const Route = createFileRoute('/_protected/events/$id/print')({
  beforeLoad: requireLoggedIn,
  loader: loader,
  component: () => <PrintEventPage routePath="/_protected/events/$id/print" />
})
