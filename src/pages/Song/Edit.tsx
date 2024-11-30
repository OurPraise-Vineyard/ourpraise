import { useState } from 'react'

import { getRouteApi } from '@tanstack/react-router'

import { deleteSong, fetchSong } from '~/backend/songs'
import { saveSong } from '~/backend/songs'
import Page from '~/components/Page'
import SongForm from '~/components/SongForm'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import { RouteLoader, RoutePath } from '~/router'

export const loader: RouteLoader = ({ params }) => fetchSong(params.id)

export default function EditSongPage({ routePath }: { routePath: RoutePath }) {
  const { useLoaderData, useNavigate } = getRouteApi(routePath)
  const navigate = useNavigate()
  const song: ISong = useLoaderData()
  useDocumentTitle(song ? `Edit song: "${song.title}"` : 'Edit song')
  const [error, setError] = useState<string | null>(null)

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
      setError(err.message)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Delete this song?')) {
      try {
        await deleteSong(song.id)
        navigate({ to: '/songs' })
      } catch (err: any) {
        setError(err.message)
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
      {error && <div className="text-red-500">{error}</div>}
    </Page>
  )
}
