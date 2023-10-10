type IFetchHookValue<T> = [FetchStatus, T | null, () => void]
type IFetchHookCreator<T> = (
  params: Record<string, string>
) => IFetchHookValue<T>

type IFormHookState<T> = [
  form: T,
  setField: (key: keyof T, value: unknown) => void
]
