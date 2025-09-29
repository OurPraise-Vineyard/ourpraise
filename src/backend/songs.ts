import type { IDocId } from '~/types/backend'
import type { ISong } from '~/types/models'
import type { ISongSchema } from '~/types/schemas'

import {
  createDocument,
  deleteDocument,
  getCollection,
  getDocument,
  updateDocument
} from './firebase'

export async function fetchSong(songId: IDocId): Promise<ISong> {
  return getDocument<ISongSchema>(`songs/${songId}`).then(song => ({
    authors: song.authors,
    body: song.body,
    id: song.id,
    key: song.key,
    title: song.title
  }))
}

export async function fetchSongs(): Promise<ISong[]> {
  return getCollection<ISongSchema>({
    path: 'songs',
    orderBy: 'title',
    sortDirection: 'asc'
  }).then(songs =>
    songs.map(song => ({
      authors: song.authors,
      body: song.body,
      id: song.id,
      key: song.key,
      title: song.title
    }))
  )
}

export async function saveSong(form: ISong): Promise<void> {
  await updateDocument<ISongSchema>(`songs/${form.id}`, {
    title: form.title,
    authors: form.authors,
    body: form.body,
    key: form.key,
    updatedAt: new Date().toISOString()
  })
}

export async function createSong(form: ISong): Promise<IDocId> {
  const doc = await createDocument<ISongSchema>('songs', {
    title: form.title,
    authors: form.authors,
    body: form.body,
    key: form.key,
    updatedAt: new Date().toISOString()
  })

  return doc.id
}

export async function deleteSong(id: IDocId): Promise<void> {
  await deleteDocument(`songs/${id}`)
}
