import { useState } from 'react'

export default function useLoadEffect (state, cb) {
  const [cached, setCached] = useState(null)

  if (state !== null && cached === null) {
    setCached(state)
    cb()
  }
}
