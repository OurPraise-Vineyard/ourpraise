import { createFileRoute } from '@tanstack/react-router'

import AddSongPage from '~/pages/Songs/AddPage'

export const Route = createFileRoute('/_protected/songs/add')({
  component: () => <AddSongPage routePath="/_protected/songs/add" />
})
