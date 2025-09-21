import { type LoaderFunctionArgs, redirect } from 'react-router'

import { fetchEvent } from '~/backend/events'
import type { BackendError } from '~/backend/firebase'

export default async function loadEvent({
  params: { id }
}: LoaderFunctionArgs) {
  try {
    if (!id) {
      return redirect('/events')
    }

    return await fetchEvent(id)
  } catch (err) {
    return redirect(
      `/not-found?error=${encodeURIComponent((err as BackendError).message)}`
    )
  }
}
