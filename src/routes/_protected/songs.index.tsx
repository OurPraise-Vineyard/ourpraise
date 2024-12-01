import { createFileRoute } from '@tanstack/react-router'

import SongsPage, { loader } from '~/pages/Songs/Page'

export const Route = createFileRoute('/_protected/songs/')({
  loader: loader,
  component: () => <SongsPage routePath="/_protected/songs/" />
})
