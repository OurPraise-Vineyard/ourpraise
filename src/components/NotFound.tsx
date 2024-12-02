import Page from '~/components/Page'

export default function NotFoundPage() {
  return (
    <Page className="pt-9">
      <h1 className="mb-2 text-title font-bold">
        Could not find what you're looking for.
      </h1>
      <p className="text-lg">The requested page was not found.</p>
    </Page>
  )
}
