import { useSearchParams } from 'react-router'

import Page from '~/components/Page'

export default function NotFoundPage() {
  const [searchParams] = useSearchParams()
  const error = searchParams.get('error')
  let formattedError

  if (error) {
    formattedError = decodeURIComponent(error)
  } else {
    formattedError = 'The requested page was not found.'
  }

  return (
    <Page className="pt-9">
      <h1 className="text-title mb-2 font-bold">
        Could not find what you're looking for.
      </h1>
      <p className="text-lg">{formattedError}</p>
    </Page>
  )
}
