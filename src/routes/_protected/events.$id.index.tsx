import { createFileRoute } from '@tanstack/react-router'

import EventPage, { loader } from '~/pages/Event/Page'

export const Route = createFileRoute('/_protected/events/$id/')({
  loader: loader,
  component: () => <EventPage routePath="/_protected/events/$id/" />
})
