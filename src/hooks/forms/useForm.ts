import { useCallback, useEffect, useState } from 'react'

export default function useForm<T>(
  data?: T,
  defaultForm?: T,
  updateOnChange?: boolean
): IFormHookState<T> {
  const [form, setForm] = useState((data || defaultForm) as T)

  useEffect(() => {
    if (updateOnChange) {
      setForm(data as T)
    }
  }, [data, updateOnChange])

  const setField = useCallback(
    (key: keyof T, value: unknown) => {
      setForm({ ...form, [key]: value })
    },
    [setForm, form]
  )

  return [form, setField]
}
