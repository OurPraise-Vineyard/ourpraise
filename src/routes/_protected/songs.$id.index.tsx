import { createFileRoute } from '@tanstack/react-router'

import { requireLoggedIn } from '~/backend/auth'
import SongPage, { loader } from '~/pages/Song/Page'

export const Route = createFileRoute('/_protected/songs/$id/')({
  beforeLoad: requireLoggedIn,
  loader: loader,
  component: () => <SongPage routePath="/_protected/songs/$id/" />
})
