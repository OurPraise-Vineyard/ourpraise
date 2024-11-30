import classNames from 'classnames'
import { useEffect, useState } from 'react'

import { Link, getRouteApi } from '@tanstack/react-router'

import { fetchSongs } from '~/backend/songs'
import {
  ellipsisTextStyles,
  pageTitleStyles,
  toolbarStyles
} from '~/common-styles'
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
      <div className={toolbarStyles}>
        <h2 className={pageTitleStyles}>
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
          <p className={classNames(ellipsisTextStyles, 'w-1/2')}>
            {song.title || (
              <span className="italic text-red-500">Missing title</span>
            )}
          </p>
          <p className={ellipsisTextStyles}>
            {song.authors || (
              <span className="italic text-red-500">Missing authors</span>
            )}
          </p>
        </Link>
      ))}
    </Page>
  )
}
