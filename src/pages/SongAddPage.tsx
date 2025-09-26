import { useNavigate } from 'react-router'

import { createSong } from '~/backend/songs'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import SongForm from '~/components/SongForm'
import type { IDocId } from '~/types/backend'
import type { ISongForm } from '~/types/forms'

export default function AddSongPage() {
  const navigate = useNavigate()
  const errors = useErrorPopUp()

  const handleSubmit = async (form: ISongForm) => {
    try {
      const id: IDocId = await createSong(form)
      if (id) {
        navigate(`/songs/${id}`)
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
