import { createFileRoute } from '@tanstack/react-router'

import { requireLoggedIn } from '~/backend/auth'
import SongsPage, { loader } from '~/pages/Songs/Page'

export const Route = createFileRoute('/_protected/songs/')({
  beforeLoad: requireLoggedIn,
  loader: loader,
  component: () => <SongsPage routePath="/_protected/songs/" />
})
