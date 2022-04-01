import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { searchSongs } from '@api/algolia'
import { createDebouncer } from '@debouncer'
import searchIcon from '@assets/search.svg'

const debounce = createDebouncer(1000)

const SearchBar = styled.input`
  font-size: 20px;
  border: none;
  flex: 1 0 auto;

  &:focus {
    outline: none;
    border: none;
  }
`

const SearchBarWrapper = styled.div`
  padding: 10px 20px;
  border: 1px solid #aaa;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1 0 auto;

  &::before {
    content: '';
    background-image: url(${searchIcon});
    width: 20px;
    height: 20px;
    display: block;
    margin-right: 10px;
  }
`

export default function SearchSongs ({ onLoadHits, onChangeLoading }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (query) {
      searchSongs(query).then(hits => onLoadHits(hits, query))
    } else {
      onLoadHits([], query)
    }
    onChangeLoading(false)
  }, [query, onLoadHits, onChangeLoading])

  function debounceSearch (q) {
    if (q === query) {
      onChangeLoading(false)
    } else {
      onChangeLoading(true)
    }

    debounce(() => setQuery(q))
  }

  return (
    <SearchBarWrapper>
      <SearchBar placeholder="Search" onChange={e => debounceSearch(e.target.value)} />
    </SearchBarWrapper>
  )
}
