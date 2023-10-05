import { pruneObject } from '@utils/api'

export function mapDocToSong(doc: IDoc): ISong {
  return {
    authors: doc.authors as string,
    body: doc.body as string,
    id: doc.id as string,
    key: doc.key as IKey,
    title: doc.title as string
  }
}

export function mapCollectionToSongs(docs: ICollection) {
  return docs.map(mapDocToSong)
}

export function mapSearchHitsToSongs(hits: ISearchHit[]): ISong[] {
  return hits.map(hit => ({
    authors: hit.authors as string,
    body: hit.body as string,
    key: hit.key as IKey,
    title: hit.title as string,
    id: hit.objectID
  }))
}

export function mapSongFormToSong(form: ISongForm): ISong {
  return pruneObject({ ...form, id: undefined })
}
