import Page from '~/components/Page'

export default function NotFoundPage() {
  return (
    <Page className="pt-9">
      <h1 className="text-title mb-2 font-bold">
        Could not find what you're looking for.
      </h1>
      <p className="text-lg">The requested page or items was not found.</p>
    </Page>
  )
}
