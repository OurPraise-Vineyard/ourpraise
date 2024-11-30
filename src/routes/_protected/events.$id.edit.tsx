import { createFileRoute } from '@tanstack/react-router'

import { requireLoggedIn } from '~/backend/auth'
import EditEventPage, { loader } from '~/pages/Event/EditPage'

export const Route = createFileRoute('/_protected/events/$id/edit')({
  beforeLoad: requireLoggedIn,
  loader: loader,
  component: () => <EditEventPage routePath="/_protected/events/$id/edit" />
})
