import {
  ellipsisTextStyles,
  pageTitleStyles,
  toolbarStyles
} from '@common-styles'
import classNames from 'classnames'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '@components/Button'
import SearchSongs from '@components/SearchSongs'
import withFetch, { IWithFetchProps } from '@components/withFetch'

import { fetchSongs } from '@backend/songs'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useSearchSongs from '@hooks/useSearchSongs'

function Songs({ data: songs }: IWithFetchProps<ISong[]>) {
  useDocumentTitle('Songs')
  const [query, setQuery] = useState<string>('')
  const { user } = useAuth()
  const [searchStatus, hits] = useSearchSongs(query)

  const items = query ? hits : songs

  return (
    <div>
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
      {searchStatus === 'loading' ? (
        <div className="flex h-full w-full items-center justify-center">
          Loading...
        </div>
      ) : (
        <div>
          {items.map(song => (
            <Link
              to={`/songs/${song.id}`}
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
        </div>
      )}
    </div>
  )
}

export default withFetch<INoProps, ISong[]>(fetchSongs)(Songs)
