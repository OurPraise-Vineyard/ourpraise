import classNames from 'classnames'
import { useEffect, useState } from 'react'

import { Link, getRouteApi } from '@tanstack/react-router'

import { fetchSongs } from '~/backend/songs'
import Button from '~/components/Button'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import SearchSongs from '~/pages/Songs/SearchField'
import type { RoutePath } from '~/router'
import type { ISong } from '~/types/models'
import { search } from '~/utils/fuzzy'

type SongsSearchParams = {
  eventId?: string
  eventTitle?: string
}

export const validateSearch = (
  search: Record<string, string>
): SongsSearchParams => ({
  eventId: search.eventId as string,
  eventTitle: search.eventTitle as string
})

export const loader = async () => fetchSongs()

export default function SongsPage({ routePath }: { routePath: RoutePath }) {
  const { useLoaderData, useSearch } = getRouteApi(routePath)
  const songs: ISong[] = useLoaderData()
  const { eventId, eventTitle } = useSearch() as SongsSearchParams
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
            <Button type="link" to="/songs/add">
              Add new song
            </Button>
          )}
        </div>
        <h2 className="text-title mt-2 grow border-b border-b-gray-300 py-4 font-bold">
          {query ? `Search results for "${query}"` : 'All songs'}
        </h2>

        {filteredSongs.map(song => (
          <Link
            to="/songs/$id"
            params={{ id: song.id }}
            search={{
              eventId,
              eventTitle
            }}
            key={song.id}
            className="flex justify-between gap-4 border-b border-gray-300 p-2 text-lg hover:bg-gray-100"
          >
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
          </Link>
        ))}
      </div>
    </Page>
  )
}
