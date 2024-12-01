import { createFileRoute } from '@tanstack/react-router'

import AddEventPage from '~/pages/Events/AddPage'

export const Route = createFileRoute('/_protected/events/add')({
  component: AddEventPage
})
