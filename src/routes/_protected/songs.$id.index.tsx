import { createFileRoute } from '@tanstack/react-router'

import SongPage, { loader } from '~/pages/Song/Page'

export const Route = createFileRoute('/_protected/songs/$id/')({
  loader: loader,
  component: () => <SongPage routePath="/_protected/songs/$id/" />
})
