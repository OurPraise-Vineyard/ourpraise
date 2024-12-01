import { createFileRoute } from '@tanstack/react-router'

import PrintEventPage, { loader } from '~/pages/Event/PrintPage'

export const Route = createFileRoute('/_protected/events/$id/print')({
  loader: loader,
  component: () => <PrintEventPage routePath="/_protected/events/$id/print" />
})
