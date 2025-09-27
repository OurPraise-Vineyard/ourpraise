import searchIcon from '~/assets/search.svg'
import useDebounced from '~/hooks/useDebounced'

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
  const [_, setQuery] = useDebounced<string>('', onSearch)

  return (
    <label className={`input grow ${className}`}>
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
