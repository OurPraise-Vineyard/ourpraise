import type { IDocId } from './backend'
import type { IKey, ISong } from './models'

export type ISongForm = {
  id?: IDocId
  key: IKey
  title: string
  authors: string
  body: string
}

export type IEventSongForm = {
  id: IDocId
  transposeKey: IKey
  comment: string
}

export type IEventFormSong = {
  id: string
  dbId: IDocId
  key: IKey
  title: string
  authors: string
  body: string
  transposeKey: IKey
}

export type IEventForm = {
  title: string
  date: string
  id?: IDocId
  comment: string
  songs: IEventFormSong[]
}
