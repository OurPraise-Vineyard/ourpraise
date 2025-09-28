/**
 * These are the document types that exist in the database (or how they should be at least)
 */
import type { IDocId } from './backend'
import type { IKey } from './keys'

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
