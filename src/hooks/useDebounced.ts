import { useEffect, useState } from 'react'

import { createDebouncer } from '~/utils/debouncer'

const debounce = createDebouncer(200)

export default function useDebounced<T>(
  initialState: T,
  onChange?: (state: T) => void
): [T, (val: T) => void] {
  const [state, setState] = useState<T>(initialState)

  useEffect(() => {
    if (onChange) onChange(state)
  }, [state, onChange])

  function debounceSetState(val: T) {
    debounce(() => setState(val), !val)
  }

  return [state, debounceSetState]
}
