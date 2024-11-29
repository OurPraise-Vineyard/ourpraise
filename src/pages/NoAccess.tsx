import { useDocumentTitle } from '@hooks/useDocumentTitle'

export default function NoAccessView() {
  useDocumentTitle()
  return (
    <div className="flex h-full w-full items-center justify-center text-center">
      You do not have access to view this site.
    </div>
  )
}
