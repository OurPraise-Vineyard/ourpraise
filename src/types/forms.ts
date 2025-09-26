import type { IDocId } from './backend'
import type { IKey } from './models'

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

export type IEventForm = {
  title: string
  date: string
  id?: IDocId
  comment: string
  songs: {
    id: IDocId
    key: IKey
    title: string
    authors: string
    body: string
    transposeKey: IKey
  }[]
}
