import { useEffect, useState } from 'react'

import { search } from '~/utils/fuzzy'

export default function useFilteredItems<T>(
  items: T[],
  query: string | null,
  searchableFields: string[]
) {
  const [filtered, setFiltered] = useState<T[]>([])

  useEffect(() => {
    if (!query) {
      setFiltered(items)
    } else {
      setFiltered(search<T>(query, items, searchableFields))
    }
  }, [items, query])

  return filtered
}
