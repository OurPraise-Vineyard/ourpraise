import { createFileRoute } from '@tanstack/react-router'

import { requireLoggedIn } from '~/backend/auth'
import EventsPage, { loader } from '~/pages/Events/Page'

export const Route = createFileRoute('/_protected/events/')({
  beforeLoad: requireLoggedIn,
  loader: loader,
  component: () => <EventsPage routePath="/_protected/events/" />
})
