import classNames from 'classnames'
import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'

import searchIcon from '~/assets/search.svg'
import useDebounced from '~/hooks/useDebounced'

type SearchBarProps = {
  className?: string
  inputRef?: React.Ref<HTMLInputElement>
}

export default function NavSearchField({ className }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const getQueryParam = () => searchParams.get('q') || ''

  const handleSearch = useCallback(
    function handleSearch(query: string) {
      if (query !== getQueryParam()) {
        setSearchParams({ q: query })
      }
    },
    [setSearchParams]
  )

  const [_, setQuery] = useDebounced<string>('', handleSearch)

  useEffect(() => {
    if (inputRef.current) {
      const initialQuery = getQueryParam()

      if (initialQuery) {
        inputRef.current.value = initialQuery
        setQuery(initialQuery)
      }
    }
  }, [inputRef.current])

  return (
    <label className={classNames('input rounded-full', className)}>
      <img className="icon" src={searchIcon} />
      <input
        className="grow"
        placeholder="Search"
        onChange={e => setQuery(e.target.value)}
        ref={inputRef}
      />
    </label>
  )
}
