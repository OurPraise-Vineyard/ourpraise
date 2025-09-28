import type { IDocId } from './backend'

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
