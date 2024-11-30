import { createSong } from '~/backend/songs'
import Page from '~/components/Page'
import SongForm from '~/components/SongForm'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import useErrors from '~/hooks/useErrors'

import { createFileRoute, useNavigate } from '@tanstack/react-router'

function AddSong() {
  useDocumentTitle('Add song')
  const navigate = useNavigate({ from: '/songs/add' })
  const { pushError } = useErrors()

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
      pushError(err)
    }
  }

  return (
    <Page>
      <SongForm onSubmit={handleSubmit} heading="Add song" />
    </Page>
  )
}

export const Route = createFileRoute('/_protected/songs/add')({
  component: AddSong
})
