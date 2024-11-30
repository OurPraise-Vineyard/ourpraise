import Login, { validateSearch } from '@pages/Auth/Login'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login')({
  validateSearch: validateSearch,
  component: () => <Login routePath="/_auth/login" />
})
