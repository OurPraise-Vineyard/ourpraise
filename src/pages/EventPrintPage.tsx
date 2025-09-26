import { useEffect } from 'react'
import { Link, useLoaderData } from 'react-router'

import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import type { IEvent } from '~/types/models'

export default function PrintEventPage() {
  const event: IEvent = useLoaderData()

  useEffect(() => {
    const t = setTimeout(() => window.print(), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <Page noAnimation>
      <MetaTitle title={event.title} />
      <div className="flex items-center justify-between gap-4 py-4 pb-4 print:hidden">
        <Link to={`/events/${event.id}`} className="btn shrink-0">
          Cancel
        </Link>
        <button
          onClick={() => window.print()}
          className="btn btn-primary shrink-0"
        >
          Print
        </button>
      </div>
      <div className="flex items-center gap-4 border-b border-b-gray-300 py-4 pb-2">
        <h2 className="text-title grow overflow-x-hidden font-bold text-ellipsis whitespace-nowrap">
          {event.title}
        </h2>
        <span className="grow-0 rounded-md p-0 text-xl whitespace-nowrap text-gray-500">
          {event.formattedDate}
        </span>
      </div>
      {!!event.comment && (
        <p className="my-4 rounded-lg border border-gray-400 p-2 text-lg whitespace-pre">
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
            <div className="w-0 grow">
              <p className="overflow-hidden text-xl font-bold text-ellipsis whitespace-nowrap">
                {song.title}
              </p>
              <p className="overflow-hidden text-lg text-ellipsis whitespace-nowrap text-gray-400">
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
            <p className="my-4 rounded-lg border border-gray-400 p-2 text-base whitespace-pre">
              {song.comment}
            </p>
          )}
          {song.body?.map((part, index) => (
            <p
              className="my-5 break-inside-avoid-page font-mono text-sm/snug whitespace-pre"
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
