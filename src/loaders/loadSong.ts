import { type LoaderFunctionArgs, redirect } from 'react-router'

import type { BackendError } from '~/backend/firebase'
import { fetchSong } from '~/backend/songs'

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
