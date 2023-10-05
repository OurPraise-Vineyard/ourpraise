import Backend from '@lib/backend'
import {
  mapCollectionToSongs,
  mapDocToSong,
  mapSearchHitsToSongs,
  mapSongFormToSong
} from '@mappers/songs'

export function fetchSong(songId: IDocId): Promise<ISong> {
  return Backend.getDoc(`songs/${songId}`).then(mapDocToSong)
}

export function fetchSongs(): Promise<ISong[]> {
  return Backend.getCollection({ path: 'songs', orderBy: 'title', sortDirection: 'asc' }).then(
    mapCollectionToSongs
  )
}

export function fetchSearchQuery(query: string): Promise<ISong[]> {
  return Backend.searchSongs(query).then(mapSearchHitsToSongs)
}

export async function saveSong(form: ISongForm): Promise<void> {
  await Backend.setDoc(`songs/${form.id}`, mapSongFormToSong(form), { merge: true })
}

export async function createSong(form: ISongForm): Promise<IDocId> {
  const doc = await Backend.createDoc('songs', {
    ...mapSongFormToSong(form),
    createdAt: new Date().toISOString()
  })

  return doc.id
}

export async function deleteSong(id: IDocId): Promise<void> {
  await Backend.deleteDoc(`songs/${id}`)
}
