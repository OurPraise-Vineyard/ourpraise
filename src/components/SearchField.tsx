import { useEffect, useState } from 'react'

import searchIcon from '~/assets/search.svg'
import clearIcon from '~/assets/x.svg'
import { createDebouncer } from '~/utils/debouncer'

const debounce = createDebouncer(200)

type SearchBarProps = {
  className?: string
  onSearch: (query: string) => void
  inputRef?: React.Ref<HTMLInputElement>
}

export default function SearchField({
  onSearch,
  inputRef,
  className
}: SearchBarProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    onSearch(query)
  }, [query, onSearch])

  function debounceSearch(q: string) {
    debounce(() => setQuery(q), !q)
  }

  function handleClear() {
    setQuery('')
  }

  return (
    <label className={`input grow ${className}`}>
      <img className="icon" src={searchIcon} />
      <input
        className="grow"
        placeholder="Search"
        onChange={e => debounceSearch(e.target.value)}
        ref={inputRef}
      />
      <img
        role="button"
        className="icon cursor-pointer"
        src={clearIcon}
        onClick={handleClear}
      />
    </label>
  )
}
