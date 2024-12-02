import { getRouteApi } from '@tanstack/react-router'

import { createSong } from '~/backend/songs'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import SongForm from '~/components/SongForm'
import { RoutePath } from '~/router'
import { IDocId } from '~/types/backend'
import { ISongForm } from '~/types/forms'

export default function AddSongPage({ routePath }: { routePath: RoutePath }) {
  const navigate = getRouteApi(routePath).useNavigate()
  const errors = useErrorPopUp()

  const handleSubmit = async (form: ISongForm) => {
    try {
      const id: IDocId = await createSong(form)
      if (id) {
        navigate({
          to: '/songs/$id',
          params: { id }
        })
      }
    } catch (err: any) {
      errors.show(err.message)
    }
  }

  return (
    <Page>
      <MetaTitle title="Add song" />
      <SongForm onSubmit={handleSubmit} heading="Add song" />
    </Page>
  )
}
