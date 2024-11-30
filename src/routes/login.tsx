import { createFileRoute } from '@tanstack/react-router'

import Login, { validateSearch } from '~/pages/Login'

export const Route = createFileRoute('/login')({
  validateSearch: validateSearch,
  component: () => <Login routePath="/login" />
})
