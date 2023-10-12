import SearchInput from 'blocks/SearchInput'
import SearchInputWrapper from 'blocks/SearchInputWrapper'
import React, { useEffect, useState } from 'react'
import { createDebouncer } from 'utils/debouncer'

const debounce = createDebouncer(1000)

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
    <SearchInputWrapper>
      <SearchInput
        placeholder="Search"
        onChange={e => debounceSearch(e.target.value)}
        ref={inputRef}
      />
    </SearchInputWrapper>
  )
}
