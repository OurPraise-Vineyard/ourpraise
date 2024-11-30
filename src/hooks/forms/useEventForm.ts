import dateFormat from 'dateformat'
import { useCallback, useReducer } from 'react'
import { getLatestLocation } from '~/hooks/useSavedLocation'
import { nextWeekday } from '~/utils/date'

type Action = {
  key: string
  value: unknown
}

const defaultEventForm = (): IEventForm => ({
  title: '',
  comment: '',
  date: dateFormat(nextWeekday(7), 'yyyy-mm-dd'),
  location: getLatestLocation(),
  songs: [],
  owner: ''
})

const reducer = (state: IEventForm, action: Action) => {
  return {
    ...state,
    [action.key as string]: action.value
  }
}

export default function useEventForm(
  event?: IEventForm
): IFormHookState<IEventForm> {
  const [form, dispatch] = useReducer(reducer, event || defaultEventForm())

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
