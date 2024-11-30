import { createFileRoute } from '@tanstack/react-router'

import AddSongPage from '~/pages/Songs/Add'

export const Route = createFileRoute('/_protected/songs/add')({
  component: () => <AddSongPage routePath="/_protected/songs/add" />
})
