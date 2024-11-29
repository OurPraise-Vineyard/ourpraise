import Page from '@components/Page'
import SongForm from '@components/SongForm'

import { requireLoggedIn } from '@backend/auth'
import { deleteSong, fetchSong } from '@backend/songs'
import { saveSong } from '@backend/songs'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useErrors from '@hooks/useErrors'
import { createFileRoute } from '@tanstack/react-router'
import { getRouteApi } from '@tanstack/react-router'

function EditSong() {
  const { useLoaderData, useNavigate } = getRouteApi(
    '/_protected/songs/$id/edit'
  )
  const navigate = useNavigate()
  const song = useLoaderData()
  const { pushError } = useErrors()
  useDocumentTitle(song ? `Edit song: "${song.title}"` : 'Edit song')

  const handleSubmit = async options => {
    try {
      await saveSong({
        ...options,
        id: song.id
      })
      navigate({
        to: '/songs/$id',
        params: { id: song.id }
      })
    } catch (err) {
      pushError(err)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Delete this song?')) {
      try {
        await deleteSong(song.id)
        navigate({ to: '/songs' })
      } catch (err) {
        pushError(err)
      }
    }
  }

  return (
    <Page>
      <SongForm
        song={song}
        onSubmit={handleSubmit}
        heading="Edit song"
        onDelete={handleDelete}
      />
    </Page>
  )
}

export const Route = createFileRoute('/_protected/songs/$id/edit')({
  beforeLoad: requireLoggedIn,
  loader: ({ params }) => fetchSong(params.id),
  component: EditSong
})
