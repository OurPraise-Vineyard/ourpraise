import { createFileRoute } from '@tanstack/react-router'

import { requireLoggedIn } from '~/backend/auth'
import EventPage, { loader } from '~/pages/Event/Page'

export const Route = createFileRoute('/_protected/events/$id/')({
  beforeLoad: requireLoggedIn,
  loader: loader,
  component: () => <EventPage routePath="/_protected/events/$id/" />
})
