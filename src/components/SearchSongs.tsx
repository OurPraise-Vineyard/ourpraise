import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import searchIcon from '@assets/search.svg'
import { createDebouncer } from '@utils/debouncer'

const debounce = createDebouncer(1000)

const SearchBar = styled.input`
  font-size: ${props => props.theme.fontSizes.regular};
  border: none;
  flex: 1 0 auto;
  width: 122px;

  &:focus {
    outline: none;
    border: none;
  }
`

const SearchBarWrapper = styled.div`
  padding: 10px 20px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 0 1 auto;
  height: ${props => props.theme.sizes.toolbarHeight};
  width: 200px;

  &::before {
    content: '';
    background-image: url(${searchIcon});
    background-size: contain;
    width: 20px;
    height: 20px;
    display: block;
    margin-right: 10px;
  }
`

interface SearchBarProps {
  onSearch: (query: string) => void
  inputRef?: React.Ref<HTMLInputElement>
}

export default function SearchSongs({ onSearch, inputRef }: SearchBarProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    onSearch(query)
  }, [query, onSearch])

  function debounceSearch(q) {
    debounce(() => setQuery(q), !q)
  }

  return (
    <SearchBarWrapper>
      <SearchBar
        placeholder="Search"
        onChange={e => debounceSearch(e.target.value)}
        ref={inputRef}
      />
    </SearchBarWrapper>
  )
}
