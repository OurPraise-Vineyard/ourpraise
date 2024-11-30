import { formatDate } from '~/utils/date'
import pruneObject from '~/utils/pruneObject'

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
    location: event.location,
    songs: (event.songs as Array<IEventSong>).map(
      (songDoc: IEventSong): IEventSong => ({
        id: songDoc.id,
        transposeKey: songDoc.transposeKey as IKey,
        comment: songDoc.comment
      })
    ),
    formattedDate: formatDate(event.date)
  }
}

export function mapEventFormToEvent(event: IEventForm): IEvent {
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

export function mapEventSongFormToEventSong(
  eventSong: IEventSongForm
): IEventSong {
  return pruneObject({
    transposeKey: eventSong.transposeKey,
    comment: eventSong.comment,
    id: eventSong.id
  })
}
