type IFetchHookValue<T> = [FetchStatus, T | null]
type IFetchHookCreator<T> = (
  params: Record<string, string>
) => IFetchHookValue<T>
