import { useCallback, useMemo, useReducer } from 'react'
import { useTheme } from 'styled-components'

type ContextMenuState = {
  top: number
  left: number
  show: boolean
}

type ContextMenuHookValue = ContextMenuState & {
  setPosition: (left: number, top: number) => void
  setShow: (show: boolean) => void
}

function reducer(state: ContextMenuState, update) {
  return {
    ...state,
    ...update
  }
}

const defaultState: ContextMenuState = {
  top: 0,
  left: 0,
  show: false
}

export default function useContextMenuState(): ContextMenuHookValue {
  const [state, dispatch] = useReducer(reducer, defaultState)
  const {
    sizes: { contextMenuWidth }
  } = useTheme()

  const setPosition = useCallback(
    (left, top) =>
      dispatch({ top: top + 25, left: left - contextMenuWidth + 25 }),
    [dispatch, contextMenuWidth]
  )
  const setShow = useCallback(show => dispatch({ show }), [dispatch])

  return useMemo(
    () => ({
      setPosition,
      setShow,
      ...state
    }),
    [state, setPosition, setShow]
  )
}
