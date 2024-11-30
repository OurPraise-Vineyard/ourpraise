import { createFileRoute } from '@tanstack/react-router'

import { requireLoggedIn } from '~/backend/auth'
import EditSongPage, { loader } from '~/pages/Song/EditPage'

export const Route = createFileRoute('/_protected/songs/$id/edit')({
  beforeLoad: requireLoggedIn,
  loader: loader,
  component: () => <EditSongPage routePath="/_protected/songs/$id/edit" />
})
