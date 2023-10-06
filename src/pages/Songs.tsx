import React, { useState } from 'react'

import { fetchSongs } from '@backend/songs'
import Center from '@components/Center'
import CompactListItem from '@components/CompactListItem'
import SearchSongs from '@components/SearchSongs'
import Toolbar from '@components/Toolbar'
import ToolbarButton from '@components/ToolbarButton'
import Title from '@components/text/Title'
import withFetch, { IWithFetchProps } from '@components/withFetch'
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
      <Toolbar>
        <Title>{query ? `Search results for "${query}"` : 'All songs'}</Title>
        <SearchSongs onSearch={setQuery} />
        {user.role === 'admin' && (
          <ToolbarButton to="/songs/add">Add new song</ToolbarButton>
        )}
      </Toolbar>
      {searchStatus === 'loading' ? (
        <Center>Loading...</Center>
      ) : (
        <div>
          {items.map(song => (
            <CompactListItem
              to={`/songs/${song.id}`}
              primary={song.title}
              secondary={song.authors}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default withFetch<ISong[]>(fetchSongs)(Songs)
