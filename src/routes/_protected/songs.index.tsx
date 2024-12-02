import { createFileRoute } from '@tanstack/react-router'

import SongsPage, { loader, validateSearch } from '~/pages/Songs/Page'

export const Route = createFileRoute('/_protected/songs/')({
  validateSearch: validateSearch,
  loader: loader,
  component: () => <SongsPage routePath="/_protected/songs/" />
})
