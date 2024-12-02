import { IDocId } from './backend'

export interface IEventSong {
  id: IDocId
  transposeKey: IKey
  comment: string
  body: Array<string>
  title: string
  authors: string
  key: IKey
  formattedKey: string
}

export interface IEvent {
  title: string
  date: string
  location?: string
  songs: Array<IEventSong>
  id: IDocId
  comment: string
  createdAt: string
  owner: string
  formattedDate: string
  isUpcoming: boolean
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
