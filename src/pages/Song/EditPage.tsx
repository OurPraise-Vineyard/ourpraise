import { getRouteApi, notFound } from '@tanstack/react-router'

import { fetchSong } from '~/backend/songs'
import { saveSong } from '~/backend/songs'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import SongForm from '~/components/SongForm'
import { RouteLoader, RoutePath } from '~/router'
import { ISongForm } from '~/types/forms'
import { ISong } from '~/types/models'

export const loader: RouteLoader = async ({ params }) => {
  try {
    return await fetchSong(params.id)
  } catch {
    throw notFound()
  }
}

export default function EditSongPage({ routePath }: { routePath: RoutePath }) {
  const { useLoaderData, useNavigate } = getRouteApi(routePath)
  const navigate = useNavigate()
  const song: ISong = useLoaderData()
  const errors = useErrorPopUp()

  const handleSubmit = async (options: ISongForm) => {
    try {
      await saveSong({
        ...options,
        id: song.id
      })
      navigate({
        to: '/songs/$id',
        params: { id: song.id }
      })
    } catch (err: any) {
      errors.show(err.message)
    }
  }

  return (
    <Page>
      <MetaTitle title={song ? `Edit song: "${song.title}"` : 'Edit song'} />
      <SongForm song={song} onSubmit={handleSubmit} heading="Edit song" />
    </Page>
  )
}
