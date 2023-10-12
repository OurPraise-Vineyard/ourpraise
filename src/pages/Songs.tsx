import React, { useState } from 'react'

import CompactListItem from '@components/CompactListItem'
import SearchSongs from '@components/SearchSongs'
import withFetch, { IWithFetchProps } from '@components/withFetch'

import Center from '@blocks/Center'
import Toolbar from '@blocks/Toolbar'
import ToolbarLinkButton from '@blocks/ToolbarLinkButton'
import Title from '@blocks/text/Title'

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
      <Toolbar>
        <Title>{query ? `Search results for "${query}"` : 'All songs'}</Title>
        <SearchSongs onSearch={setQuery} />
        {user?.role === 'admin' && (
          <ToolbarLinkButton to="/songs/add">Add new song</ToolbarLinkButton>
        )}
      </Toolbar>
      {searchStatus === 'loading' ? (
        <Center>Loading...</Center>
      ) : (
        <div>
          {items.map(song => (
            <CompactListItem
              key={song.id}
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

export default withFetch<INoProps, ISong[]>(fetchSongs)(Songs)
