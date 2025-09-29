import { Link, useLoaderData, useSearchParams } from 'react-router'

import useDocumentTitle from '~/hooks/useDocumentTitle'
import useFilteredItems from '~/hooks/useFilteredItems'
import type { ISong } from '~/types/models'

export default function SongsPage() {
  useDocumentTitle('Songs')
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const songs: ISong[] = useFilteredItems(useLoaderData(), query, [
    'title',
    'authors',
    'body'
  ])

  return (
    <>
      <ul className="list bg-base-100 rounded-box mt-4 shadow-md">
        {query ? (
          <li className="p-4 pb-2 text-xs tracking-wide opacity-60">
            Search results for "{query}"
          </li>
        ) : (
          <></>
        )}

        {songs.map(song => (
          <li key={song.id}>
            <Link
              to={`/songs/${song.id}`}
              className="list-row hover:bg-base-200"
            >
              <div className="list-col-grow">
                <p className="w-1/2 overflow-hidden text-ellipsis whitespace-nowrap">
                  {song.title || (
                    <span className="text-red-500 italic">Missing title</span>
                  )}
                </p>
                <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {song.authors || (
                    <span className="text-red-500 italic">Missing authors</span>
                  )}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
