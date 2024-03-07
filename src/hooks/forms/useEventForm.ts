import dateFormat from 'dateformat'
import { useCallback, useReducer } from 'react'

import { nextWeekday } from '@utils/date'
import { locations } from '@hooks/useSavedLocation'

type Action = {
  key: string
  value: unknown
}

const defaultEventForm: IEventForm = {
  title: '',
  comment: '',
  date: dateFormat(nextWeekday(7), 'yyyy-mm-dd'),
  location: localStorage.getItem('event_location') || locations[0].value,
  songs: [],
  owner: ''
}

const reducer = (state: IEventForm, action: Action) => {
  return {
    ...state,
    [action.key as string]: action.value
  }
}

export default function useEventForm(
  event?: IEventForm
): IFormHookState<IEventForm> {
  const [form, dispatch] = useReducer(reducer, event || defaultEventForm)

  const setField = useCallback(
    (key: keyof IEventForm, value: unknown) => {
      if (key === 'location') {
        localStorage.setItem('event_location', value as string)
      }
      dispatch({ key, value })
    },
    [dispatch]
  )

  return [form, setField]
}
