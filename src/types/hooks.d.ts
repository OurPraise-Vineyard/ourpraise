type IFetchHookValue<T> = [FetchStatus, T]
type IFetchHookCreator<T> = (
  params: Record<string, string>
) => IFetchHookValue<T>
