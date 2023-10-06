import { fetchSong } from '@backend/songs'
import Backend from '@lib/backend'
import {
  mapCollectionToSongLists,
  mapDocToSongList,
  mapSongListFormToSongList
} from '@mappers/songLists'
import { sortByTitleAsc } from '@utils/api'

export function fetchSongLists(): Promise<ISongList[]> {
  return Backend.getCollection({
    path: 'songLists',
    orderBy: 'lastModified',
    sortDirection: 'desc'
  }).then(mapCollectionToSongLists)
}

export async function fetchSongList(songListId: IDocId): Promise<ISongList> {
  const songList = await Backend.getDoc(`songLists/${songListId}`).then(
    mapDocToSongList
  )

  const songs: ISong[] = (
    await Promise.all(songList.songIds.map(songId => fetchSong(songId)))
  ).sort(sortByTitleAsc)

  return {
    ...songList,
    songs
  }
}

export async function saveSongList(form: ISongListForm): Promise<void> {
  Backend.setDoc(`songLists/${form.id}`, mapSongListFormToSongList(form), {
    merge: true
  })
}

export async function createSongList(form: ISongListForm): Promise<IDocId> {
  const doc = await Backend.createDoc(
    'songLists',
    mapSongListFormToSongList(form)
  )

  return doc.id
}

export async function deleteSongList(id: IDocId): Promise<void> {
  await Backend.deleteDoc(`songLists/${id}`)
}
