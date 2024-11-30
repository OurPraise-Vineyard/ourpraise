type IFetchHookValue<T> = [FetchStatus, T | null, () => void]
type IFetchHookCreator<T> = (
  params: Record<string, string>
) => IFetchHookValue<T>
