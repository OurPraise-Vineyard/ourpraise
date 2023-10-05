import { pruneObject } from '@utils/api'
import { keysOptions, transposeSong } from '@utils/chords'

export function mapCollectionToEvents(docs: ICollection): IEvent[] {
  return docs.map(mapDocToEvent)
}

export function mapDocToEvent(doc: IDoc): IEvent {
  return {
    comment: doc.comment as string,
    createdAt: doc.createdAt as string,
    date: doc.date as string,
    id: doc.id as string,
    owner: doc.owner as string,
    songs: (doc.songs as Array<IDoc>).map(
      (songDoc: IDoc): IEventSong => ({
        id: songDoc.id as string,
        transposeKey: songDoc.transposeKey as IKey,
        comment: songDoc.comment as string
      })
    ),
    title: doc.title as string
  }
}

export function mergeSongEventSong(song: ISong, eventSong: IEventSong): IEventSong {
  const body = transposeSong(
    song.body.replace(/^\/\//gm, '  ').replace(/\n\s+?\n/g, '\n\n'),
    song.key,
    eventSong.transposeKey || song.key
  ).split('\n\n')

  const songKey = eventSong.transposeKey || song.key
  const formattedKey = keysOptions.find(key => key.value === songKey).label

  return {
    ...song,
    ...eventSong,
    body,
    formattedKey
  }
}

export function mapEventFormToEvent(event: IEventForm) {
  return pruneObject({
    ...event,
    id: undefined,
    songs: event.songs.map(song =>
      pruneObject({
        id: song.id,
        transposeKey: song.transposeKey,
        comment: song.comment
      })
    )
  })
}
