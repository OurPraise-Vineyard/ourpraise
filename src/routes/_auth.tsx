import AuthLayout from '~/pages/Auth/Layout'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout
})
