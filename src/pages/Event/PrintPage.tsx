import { useEffect } from 'react'

import { getRouteApi } from '@tanstack/react-router'

import { fetchEvent } from '~/backend/events'
import Button from '~/components/Button'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import { RouteLoader, RoutePath } from '~/router'
import { IEvent } from '~/types/models'

export const loader: RouteLoader = ({ params }) => fetchEvent(params.id)

export default function PrintEventPage({
  routePath
}: {
  routePath: RoutePath
}) {
  const event: IEvent = getRouteApi(routePath).useLoaderData()

  useEffect(() => {
    const t = setTimeout(() => window.print(), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <Page noAnimation>
      <MetaTitle title={`Printing ${event.title}...`} />
      <div className="flex items-center justify-between gap-4 py-4 pb-4 print:hidden">
        <Button
          type="link"
          to="/events/$id"
          params={{ id: event.id }}
          className="flex-shrink-0"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => window.print()}
          className="flex-shrink-0"
          variant="primary"
        >
          Print
        </Button>
      </div>
      <div className="flex items-center gap-4 border-b border-b-gray-300 py-4 pb-2">
        <h2 className="text-title flex-grow overflow-x-hidden text-ellipsis whitespace-nowrap font-bold">
          {event.title}
        </h2>
        <span className="flex-grow-0 whitespace-nowrap rounded-md p-0 text-xl text-gray-500">
          {event.formattedDate}
        </span>
      </div>
      {!!event.comment && (
        <p className="my-4 whitespace-pre rounded-lg border border-gray-400 p-2 text-lg">
          {event.comment}
        </p>
      )}
      <ul className="mt-5 list-disc break-after-page py-2 pl-10 text-xl">
        {event.songs.map(song => (
          <li key={song.id}>{song.title}</li>
        ))}
      </ul>
      {event.songs.map(song => (
        <div
          className="my-8 break-after-page pb-8 last:break-after-auto print:p-0"
          key={song.id}
        >
          <div className="flex w-full items-center gap-2 border-b border-b-gray-300 pb-2">
            <div className="w-0 flex-grow">
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold">
                {song.title}
              </p>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-lg text-gray-400">
                {song.authors}
              </p>
            </div>
            {song.formattedKey && (
              <div className="rounded-3xl border border-black px-3 py-2">
                {song.formattedKey}
              </div>
            )}
          </div>
          {song.comment && (
            <p className="my-4 whitespace-pre rounded-lg border border-gray-400 p-2 text-base">
              {song.comment}
            </p>
          )}
          {song.body?.map((part, index) => (
            <p
              className="my-5 break-inside-avoid-page whitespace-pre font-mono text-sm/snug"
              key={index}
            >
              {part}
            </p>
          ))}
        </div>
      ))}
    </Page>
  )
}
