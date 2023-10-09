import { useCallback, useReducer } from 'react'

type Action = {
  key: string
  value: unknown
}

const defaultSongForm: ISongForm = {
  title: '',
  authors: '',
  body: '',
  key: 'A'
}

const reducer = (state: ISongForm, action: Action) => {
  return {
    ...state,
    [action.key as string]: action.value
  }
}

export default function useSongForm(
  song?: ISongForm
): IFormHookState<ISongForm> {
  const [form, dispatch] = useReducer(reducer, song || defaultSongForm)

  const setField = useCallback(
    (key: keyof ISongForm, value: unknown) => {
      dispatch({ key, value })
    },
    [dispatch]
  )

  return [form, setField]
}
