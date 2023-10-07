import { pruneObject } from '@utils/api'
import { keysOptions, transposeSong } from '@utils/chords'

export function mapCollectionToEvents(docs: ICollection): IEvent[] {
  return docs.map(mapDocToEvent)
}

export function mapDocToEvent(doc: IDoc): IEvent {
  const event = doc as IEvent

  return {
    comment: event.comment,
    createdAt: event.createdAt,
    date: event.date,
    id: doc.id,
    owner: event.owner,
    title: event.title,
    songs: (event.songs as Array<IEventSong>).map(
      (songDoc: IEventSong): IEventSong => ({
        id: songDoc.id,
        transposeKey: songDoc.transposeKey as IKey,
        comment: songDoc.comment
      })
    )
  }
}

export function mergeSongEventSong(
  song: ISong,
  eventSong: IEventSong
): IEventSong {
  const body = transposeSong(
    song.body.replace(/^\/\//gm, '  ').replace(/\n\s+?\n/g, '\n\n'),
    song.key,
    eventSong.transposeKey || song.key
  ).split('\n\n')

  const songKey = eventSong.transposeKey || song.key
  const formattedKey = keysOptions.find(key => key.value === songKey)?.label

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
