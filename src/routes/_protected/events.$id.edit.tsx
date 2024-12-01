import { createFileRoute } from '@tanstack/react-router'

import EditEventPage, { loader } from '~/pages/Event/EditPage'

export const Route = createFileRoute('/_protected/events/$id/edit')({
  loader: loader,
  component: () => <EditEventPage routePath="/_protected/events/$id/edit" />
})
