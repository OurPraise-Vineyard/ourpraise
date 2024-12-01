import { createFileRoute } from '@tanstack/react-router'

import EventsPage, { loader } from '~/pages/Events/Page'

export const Route = createFileRoute('/_protected/events/')({
  loader: loader,
  component: () => <EventsPage routePath="/_protected/events/" />
})
