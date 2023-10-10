import pruneObject from '@utils/pruneObject'

export function mapDocToSongList(doc: IDoc): ISongList {
  const songList = doc as ISongList
  return {
    id: songList.id,
    lastModified: songList.lastModified,
    name: songList.name,
    songIds: songList.songIds
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
