interface IBackendError {
  message: string
  name: string
}

type ICollectionQuery = {
  path: string
  orderBy?: string
  sortDirection?: 'asc' | 'desc'
}

type ISearchHit = {
  objectID: IDocId
}

type IDoc = {
  id: IDocId
}

type ICollection = IDoc[]

type IDocId = string

type FetchStatus = 'idle' | 'loading' | 'failed' | 'succeeded'

type IFailedFetchHandler = (err: IBackendError) => void
