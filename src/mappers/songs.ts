import pruneObject from '@utils/pruneObject'

export function mapDocToSong(doc: IDoc): ISong {
  const song = doc as ISong
  return {
    authors: song.authors as string,
    body: song.body as string,
    id: song.id as string,
    key: song.key as IKey,
    title: song.title as string
  }
}

export function mapCollectionToSongs(docs: ICollection) {
  return docs.map(mapDocToSong)
}

export function mapSearchHitsToSongs(hits: ISearchHit[]): ISong[] {
  return hits.map(hit => {
    const song = hit as unknown as ISong
    return {
      authors: song.authors as string,
      body: song.body as string,
      key: song.key as IKey,
      title: song.title as string,
      id: hit.objectID
    }
  })
}

export function mapSongFormToSong(form: ISongForm): ISong {
  return pruneObject({ ...form, id: undefined })
}
