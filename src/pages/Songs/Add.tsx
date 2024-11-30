import { createFileRoute, getRouteApi } from '@tanstack/react-router'

import { createSong } from '~/backend/songs'
import Page from '~/components/Page'
import SongForm from '~/components/SongForm'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import { RoutePath } from '~/router'

export default function AddSongPage({ routePath }: { routePath: RoutePath }) {
  useDocumentTitle('Add song')
  const navigate = getRouteApi(routePath).useNavigate()

  const handleSubmit = async options => {
    try {
      const id: IDocId = await createSong(options)
      if (id) {
        navigate({
          to: '/songs/$id',
          params: { id }
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Page>
      <SongForm onSubmit={handleSubmit} heading="Add song" />
    </Page>
  )
}
