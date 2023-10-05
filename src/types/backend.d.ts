interface ICollectionQuery {
  path: string
  orderBy?: string
  sortDirection?: 'asc' | 'desc'
}

type ISearchHit = {
  [index: string]: unknown
  objectID: IDocId
}

type IDoc = {
  [index: string]: unknown
  id: IDocId
}

type ICollection = IDoc[]

type IDocId = string

type FetchStatus = 'idle' | 'loading' | 'failed' | 'succeeded'
