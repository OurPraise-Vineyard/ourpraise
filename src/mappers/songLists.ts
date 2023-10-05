import { pruneObject } from '@utils/api'

export function mapDocToSongList(doc: IDoc): ISongList {
  return {
    id: doc.id,
    lastModified: doc.lastModified as string,
    name: doc.name as string,
    songIds: doc.songIds as Array<string>
  }
}

export function mapCollectionToSongLists(docs: ICollection): ISongList[] {
  return docs.map(mapDocToSongList)
}

export function mapSongListFormToSongList(form: ISongListForm): ISongList {
  return pruneObject({
    ...form,
    id: undefined,
    songs: undefined,
    songIds: form.songs.map(song => song.id),
    lastModified: new Date().toISOString()
  })
}
