import {
  ellipsisTextStyles,
  pageTitleStyles,
  toolbarStyles
} from '@common-styles'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

import Button from '@components/Button'
import Page from '@components/Page'
import SearchSongs from '@components/SearchField'

import { getAuthState, requireLoggedIn } from '@backend/auth'
import { fetchSongs } from '@backend/songs'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { Link, createFileRoute, getRouteApi } from '@tanstack/react-router'
import { search } from '@utils/fuzzy'

function Songs() {
  const songs: ISong[] = getRouteApi('/_protected/songs/').useLoaderData()
  useDocumentTitle('Songs')
  const [query, setQuery] = useState<string>('')
  const { user } = getAuthState()

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
        {user?.role === 'admin' && (
          <Button
            type="link"
            to="/songs/add"
            variant="primary"
            className="h-toolbar"
          >
            Add new song
          </Button>
        )}
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

export const Route = createFileRoute('/_protected/songs/')({
  beforeLoad: requireLoggedIn,
  loader: () => fetchSongs(),
  component: Songs
})
