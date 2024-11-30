import Register, { validateSearch } from '~/pages/Auth/Register'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/register')({
  validateSearch: validateSearch,
  component: () => <Register routePath="/_auth/register" />
})
