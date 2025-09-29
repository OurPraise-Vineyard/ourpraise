import type { IDocId, ISong, ISongSchema } from '~/types'
import { DatabaseCache } from '~/utils/cache'

import {
  createDocument,
  deleteDocument,
  getCollection,
  getDocument,
  updateDocument
} from './firebase'

const cache = new DatabaseCache<ISongSchema>()

export async function fetchSong(songId: IDocId): Promise<ISong> {
  const mapper = (song: ISongSchema): ISong => ({
    authors: song.authors,
    body: song.body,
    id: song.id,
    key: song.key,
    title: song.title
  })

  const cached = cache.getDocument(songId)
  if (cached) {
    return mapper(cached)
  }

  const document = await getDocument<ISongSchema>(`songs/${songId}`)

  cache.setDocument(songId, document)

  return mapper(document)
}

export async function fetchSongs(): Promise<ISong[]> {
  const mapper = (songs: ISongSchema[]): ISong[] =>
    songs.map(song => ({
      authors: song.authors,
      body: song.body,
      id: song.id,
      key: song.key,
      title: song.title
    }))

  const cached = cache.getCollection('songs')

  if (cached.length > 0) {
    return mapper(cached)
  }

  const collection = await getCollection<ISongSchema>({
    path: 'songs',
    orderBy: 'title',
    sortDirection: 'asc'
  })

  cache.setCollection(
    'songs',
    collection.map(item => item.id)
  )

  collection.forEach(item => cache.setDocument(item.id, item))

  return mapper(collection)
}

export async function saveSong(form: ISong): Promise<void> {
  const options = {
    title: form.title,
    authors: form.authors,
    body: form.body,
    key: form.key,
    updatedAt: new Date().toISOString()
  }
  await updateDocument<ISongSchema>(`songs/${form.id}`, options)

  cache.setDocument(form.id, { id: form.id, ...options })
}

export async function createSong(form: ISong): Promise<IDocId> {
  const options = {
    title: form.title,
    authors: form.authors,
    body: form.body,
    key: form.key,
    updatedAt: new Date().toISOString()
  }
  const doc = await createDocument<ISongSchema>('songs', options)

  cache.setDocument(doc.id, {
    ...options,
    id: doc.id
  })
  cache.deleteCollection('songs')

  return doc.id
}

export async function deleteSong(id: IDocId): Promise<void> {
  await deleteDocument(`songs/${id}`)

  cache.deleteDocument(id)
}
