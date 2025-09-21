import { type LoaderFunctionArgs, redirect } from 'react-router'

import { fetchSong } from '~/backend/songs'
import type { BackendError } from '~/lib/firebase'

export default async function loadSong({ params: { id } }: LoaderFunctionArgs) {
  try {
    if (!id) {
      return redirect('/songs')
    }

    return await fetchSong(id)
  } catch (err) {
    return redirect(
      `/not-found?error=${encodeURIComponent((err as BackendError).message)}`
    )
  }
}
