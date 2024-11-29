import { useCallback, useMemo, useReducer } from 'react'

const contextMenuWidth = 160

type ContextMenuState = {
  top: number
  left: number
  show: boolean
}

type ContextMenuHookValue = ContextMenuState & {
  setPosition: (left: number, top: number) => void
  setShow: (show: boolean) => void
  onOpen: React.MouseEventHandler<HTMLElement>
  onClose: () => void
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

  const setPosition = useCallback(
    (left, top) => dispatch({ top: top + 15, left }),
    [dispatch]
  )
  const setShow = useCallback(show => dispatch({ show }), [dispatch])
  const onOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } =
        e.currentTarget
      const left = offsetLeft + offsetWidth - contextMenuWidth
      const top = offsetTop + offsetHeight - window.scrollY
      setPosition(left, top)
      setShow(true)
    },
    [setPosition, setShow, contextMenuWidth]
  )
  const onClose = useCallback(() => setShow(false), [setShow])

  return useMemo(
    () => ({
      setPosition,
      setShow,
      onOpen,
      onClose,
      ...state
    }),
    [state, setPosition, setShow, onClose, onOpen]
  )
}
