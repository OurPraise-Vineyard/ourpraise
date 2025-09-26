import { useLoaderData, useNavigate } from 'react-router'

import { saveSong } from '~/backend/songs'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import SongForm from '~/components/SongForm'
import type { ISongForm } from '~/types/forms'
import type { ISong } from '~/types/models'

export default function EditSongPage() {
  const navigate = useNavigate()
  const song: ISong = useLoaderData()
  const errors = useErrorPopUp()

  const handleSubmit = async (options: ISongForm) => {
    try {
      await saveSong({
        ...options,
        id: song.id
      })
      navigate(`/songs/${song.id}`)
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
