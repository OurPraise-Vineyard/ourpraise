import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { createDebouncer } from '@utils/debouncer'
import searchIcon from '@assets/search.svg'
import AppTheme from '@styles/AppTheme'

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
  border: 1px solid ${AppTheme.colors.border};
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

interface SearchBarProps {
  onSearch: (query: string) => void,
  onChangeLoading: (val: boolean) => void
}

const defaultChangeFunc = () => undefined
export default function SearchSongs ({ onSearch, onChangeLoading = defaultChangeFunc }: SearchBarProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    onSearch(query)
  }, [query, onSearch])

  function debounceSearch (q) {
    if (q === query) {
      onChangeLoading(false)
    } else {
      onChangeLoading(true)
    }

    debounce(() => setQuery(q), !q)
  }

  return (
    <SearchBarWrapper>
      <SearchBar placeholder="Search" onChange={e => debounceSearch(e.target.value)} />
    </SearchBarWrapper>
  )
}
