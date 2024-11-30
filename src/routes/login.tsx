import { createFileRoute } from '@tanstack/react-router'

import Login, { validateSearch } from '~/pages/LoginPage'

export const Route = createFileRoute('/login')({
  validateSearch: validateSearch,
  component: () => <Login routePath="/login" />
})
