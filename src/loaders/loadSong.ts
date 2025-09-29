import { type LoaderFunctionArgs, redirect } from 'react-router'

import { fetchSong } from '~/backend/songs'

export default async function loadSong({ params: { id } }: LoaderFunctionArgs) {
  if (!id) {
    return redirect('/songs')
  }

  return await fetchSong(id)
}
