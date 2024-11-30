import { createFileRoute } from '@tanstack/react-router'

import { requireLoggedIn } from '~/backend/auth'
import AddEventPage from '~/pages/Events/Add'

export const Route = createFileRoute('/_protected/events/add')({
  beforeLoad: requireLoggedIn,
  component: AddEventPage
})
