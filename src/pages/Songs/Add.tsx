import { useState } from 'react'

import { getRouteApi } from '@tanstack/react-router'

import { createSong } from '~/backend/songs'
import Page from '~/components/Page'
import SongForm from '~/components/SongForm'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import { RoutePath } from '~/router'
import { IDocId } from '~/types/backend'
import { ISongForm } from '~/types/forms'

export default function AddSongPage({ routePath }: { routePath: RoutePath }) {
  useDocumentTitle('Add song')
  const navigate = getRouteApi(routePath).useNavigate()
  const [error, setError] = useState<string | null>(null)

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
      setError(err.message)
    }
  }

  return (
    <Page>
      <SongForm onSubmit={handleSubmit} heading="Add song" />
      {error && <div className="text-red-500">{error}</div>}
    </Page>
  )
}
