import { type LoaderFunctionArgs, redirect } from 'react-router'

import { fetchEvent } from '~/backend/events'

export default async function loadEvent({
  params: { id }
}: LoaderFunctionArgs) {
  if (!id) {
    return redirect('/events')
  }

  return await fetchEvent(id)
}
