import {
  createDocument,
  deleteDocument,
  getCollection,
  getDocument,
  updateDocument
} from '~/lib/database'
import {
  mapCollectionToSongs,
  mapDocToSong,
  mapSongFormToSong
} from '~/mappers/songs'

export function fetchSong(songId: IDocId): Promise<ISong> {
  return getDocument(`songs/${songId}`).then(mapDocToSong)
}

export function fetchSongs(): Promise<ISong[]> {
  return getCollection({
    path: 'songs',
    orderBy: 'title',
    sortDirection: 'asc'
  }).then(mapCollectionToSongs)
}

export async function saveSong(form: ISongForm): Promise<void> {
  await updateDocument(`songs/${form.id}`, mapSongFormToSong(form), {
    merge: true
  })
}

export async function createSong(form: ISongForm): Promise<IDocId> {
  const doc = await createDocument('songs', {
    ...mapSongFormToSong(form),
    createdAt: new Date().toISOString()
  })

  return doc.id
}

export async function deleteSong(id: IDocId): Promise<void> {
  await deleteDocument(`songs/${id}`)
}
