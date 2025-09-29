import type { WhereFilterOp } from 'firebase/firestore'

/**
 * These are types related to the backend and querying
 */

export interface IBackendError {
  message: string
  name: string
}

export type ICollectionQuery = {
  path: string
  orderBy?: string
  where?: [string, WhereFilterOp, any][]
  sortDirection?: 'asc' | 'desc'
}

export type IDocId = string

export type ILoginStatus = 'loggedIn' | 'loggedOut'

export interface IUser {
  email: string
  displayName: string
}

export interface IAuthState {
  user: IUser | null
  status: ILoginStatus
}

/**
 * These are the document types that exist in the database (or how they should be at least)
 */

export type IKey =
  | 'Ab'
  | 'A'
  | 'Bb'
  | 'B'
  | 'C'
  | 'Db'
  | 'D'
  | 'Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'Gb'
  | 'G'

export type IEventSongSchema = {
  id: IDocId
  transposeKey: IKey
}

export type IEventSchema = {
  id: IDocId
  owner: string
  title: string
  date: string
  comment: string
  location: string
  updatedAt: string
  songs: IEventSongSchema[]
}

export type ISongSchema = {
  id: IDocId
  key: IKey
  title: string
  authors: string
  body: string
  updatedAt: string
}

/**
 * These are models used in the client. They can be different from schemas in the database
 */

export interface IEventSong {
  id: IDocId
  transposeKey: IKey
  body: string
  title: string
  authors: string
  key: IKey
}

export interface IEvent {
  title: string
  date: string
  location?: string
  songs?: IEventSong[]
  id: IDocId
  comment: string
  owner: string
}

export interface ISong {
  id: IDocId
  key: IKey
  title: string
  authors: string
  body: string
}
