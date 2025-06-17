import {
  createDocument,
  deleteDocument,
  getCollection,
  getDocument,
  updateDocument
} from '~/lib/database'
import type { IDocId } from '~/types/backend'
import type { ISongForm } from '~/types/forms'
import type { IKey, ISong } from '~/types/models'

export function fetchSong(songId: IDocId): Promise<ISong> {
  return getDocument(`songs/${songId}`).then(song => ({
    authors: song.authors as string,
    body: song.body as string,
    id: song.id as string,
    key: song.key as IKey,
    title: song.title as string
  }))
}

export function fetchSongs(): Promise<ISong[]> {
  return getCollection({
    path: 'songs',
    orderBy: 'title',
    sortDirection: 'asc'
  }).then(songs =>
    songs.map(song => ({
      authors: song.authors as string,
      body: song.body as string,
      id: song.id as string,
      key: song.key as IKey,
      title: song.title as string
    }))
  )
}

export async function saveSong(form: ISongForm): Promise<void> {
  await updateDocument(`songs/${form.id}`, {
    title: form.title,
    authors: form.authors,
    body: form.body,
    key: form.key
  })
}

export async function createSong(form: ISongForm): Promise<IDocId> {
  const doc = await createDocument('songs', {
    title: form.title,
    authors: form.authors,
    body: form.body,
    key: form.key,
    createdAt: new Date().toISOString()
  })

  return doc.id
}

export async function deleteSong(id: IDocId): Promise<void> {
  await deleteDocument(`songs/${id}`)
}
