import { useEffect, useState } from 'react'

import { Link, getRouteApi } from '@tanstack/react-router'

import { fetchSongs } from '~/backend/songs'
import Button from '~/components/Button'
import Page from '~/components/Page'
import SearchSongs from '~/components/SearchField'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import { RoutePath } from '~/router'
import { search } from '~/utils/fuzzy'

export const loader = () => fetchSongs()

export default function SongsPage({ routePath }: { routePath: RoutePath }) {
  const songs: ISong[] = getRouteApi(routePath).useLoaderData()
  useDocumentTitle('Songs')
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
    <Page>
      <div className="flex items-center gap-4 border-b border-b-gray-300 py-4">
        <h2 className="text-title flex-grow font-bold">
          {query ? `Search results for "${query}"` : 'All songs'}
        </h2>
        <SearchSongs onSearch={setQuery} />
        <Button
          type="link"
          to="/songs/add"
          variant="primary"
          className="h-toolbar"
        >
          Add new song
        </Button>
      </div>

      {filteredSongs.map(song => (
        <Link
          to="/songs/$id"
          params={{ id: song.id }}
          key={song.id}
          className="flex justify-between gap-4 border-b border-gray-300 p-2 text-lg hover:bg-gray-100"
        >
          <p className="w-1/2 overflow-hidden text-ellipsis whitespace-nowrap">
            {song.title || (
              <span className="italic text-red-500">Missing title</span>
            )}
          </p>
          <p className="overflow-hidden text-ellipsis whitespace-nowrap">
            {song.authors || (
              <span className="italic text-red-500">Missing authors</span>
            )}
          </p>
        </Link>
      ))}
    </Page>
  )
}
