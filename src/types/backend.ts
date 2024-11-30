import { WhereFilterOp } from 'firebase/firestore'

export interface IBackendError {
  message: string
  name: string
}

export type ICollectionQuery = {
  path: string
  orderBy?: string
  where?: [string, WhereFilterOp, any]
  sortDirection?: 'asc' | 'desc'
}

export type ISearchHit = {
  objectID: IDocId
}

export type IDoc = {
  id: IDocId
  [key: string]: any
}

export type IDocCreate = Omit<IDoc, 'id'>
export type IDocUpdate = Omit<IDoc, 'id'>

export type ICollection = IDoc[]

export type IDocId = string

export type FetchStatus = 'idle' | 'loading' | 'failed' | 'succeeded'
export type ILoginStatus = 'loggedIn' | 'loggedOut' | 'undetermined'

export interface IUser extends IUserMetadata {
  email: string
  displayName: string
}

export interface IUserMetadata {
  role: 'user' | 'admin'
}
