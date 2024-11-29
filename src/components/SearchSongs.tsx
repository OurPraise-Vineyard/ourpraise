import React, { useEffect, useState } from 'react'

import searchIcon from '@assets/search.svg'
import { createDebouncer } from '@utils/debouncer'

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
    <div className="h-toolbar flex w-48 items-center rounded-md border px-4 py-2">
      <div
        className="mr-2 h-4 w-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${searchIcon})` }}
      />
      <input
        className="w-32 flex-grow border-none text-lg focus:outline-none"
        placeholder="Search"
        onChange={e => debounceSearch(e.target.value)}
        ref={inputRef}
      />
    </div>
  )
}
