import { createFileRoute } from '@tanstack/react-router'

import EditSongPage, { loader } from '~/pages/Song/EditPage'

export const Route = createFileRoute('/_protected/songs/$id/edit')({
  loader: loader,
  component: () => <EditSongPage routePath="/_protected/songs/$id/edit" />
})
