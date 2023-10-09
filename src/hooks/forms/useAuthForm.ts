import { useCallback, useReducer } from 'react'

type IAuthForm = {
  name: string
  email: string
  password: string
  repeatPassword: string
  isInvite: boolean
}

type Action = {
  key: keyof IAuthForm
  value: unknown
}

const defaultAuthForm: IAuthForm = {
  name: '',
  email: '',
  password: '',
  repeatPassword: '',
  isInvite: false
}

const reducer = (state: IAuthForm, action: Action) => {
  return {
    ...state,
    [action.key]: action.value
  }
}

export default function useAuthForm(): IFormHookState<IAuthForm> {
  const [form, dispatch] = useReducer(reducer, defaultAuthForm)

  const setField = useCallback(
    (key: keyof IAuthForm, value: unknown) => {
      dispatch({ key, value })
    },
    [dispatch]
  )

  return [form, setField]
}
