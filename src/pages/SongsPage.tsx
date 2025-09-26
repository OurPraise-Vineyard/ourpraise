import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLoaderData, useSearchParams } from 'react-router'

import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import SearchSongs from '~/components/SearchField'
import type { ISong } from '~/types/models'
import { search } from '~/utils/fuzzy'
import { formatLink } from '~/utils/link-formatter'

export default function SongsPage() {
  const [searchParams] = useSearchParams()
  const songs: ISong[] = useLoaderData()
  const eventId = searchParams.get('eventId')
  const eventTitle = searchParams.get('eventTitle')
  const [query, setQuery] = useState<string>('')

  const [filteredSongs, setFilteredSongs] = useState<ISong[]>([])

  useEffect(() => {
    if (!query) {
      setFilteredSongs(songs)
    } else {
      setFilteredSongs(search(query, songs, ['title', 'authors', 'body']))
    }
  }, [songs, query])

  return (
    <Page className="px-0 pt-0 sm:px-5">
      <MetaTitle title="Songs" />
      {!!eventId && (
        <div
          className={classNames(
            'top-4 mb-3 flex w-full flex-col items-center justify-center border-b border-gray-200 bg-slate-50 p-5 text-lg sm:sticky sm:mt-8 sm:flex-row sm:rounded-full sm:border sm:shadow-md'
          )}
        >
          <span className="mr-1">Adding songs to</span>
          <span className="font-bold">{eventTitle}</span>
        </div>
      )}
      <div className="px-5 pt-5 sm:px-0">
        <div className="flex items-center justify-between gap-4">
          <SearchSongs onSearch={setQuery} />
          {!eventId && (
            <Link className="btn" to="/songs/add">
              Add new song
            </Link>
          )}
        </div>

        <ul className="list mt-4">
          {query ? (
            <li className="p-4 pb-2 text-xs tracking-wide opacity-60">
              Search results for "{query}"
            </li>
          ) : (
            <></>
          )}

          {filteredSongs.map(song => (
            <li>
              <NavLink
                to={formatLink(`/songs/${song.id}`, { eventId, eventTitle })}
                key={song.id}
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
                      <span className="text-red-500 italic">
                        Missing authors
                      </span>
                    )}
                  </p>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </Page>
  )
}
