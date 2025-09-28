import { fetchSong } from '~/backend/songs'
import type { IDocId } from '~/types/backend'
import type { IEvent, IEventSong, ISong } from '~/types/models'
import type { IEventSchema, IEventSongSchema } from '~/types/schemas'
import { formatKey, transposeAndFormatSong } from '~/utils/chords'
import { formatDate, getTime, lastMonth, todayTime } from '~/utils/date'
import { getLatestLocation } from '~/utils/location'

import { getAuthState } from './auth'
import {
  createDocument,
  deleteDocument,
  getCollection,
  getDocument,
  updateDocument
} from './firebase'

export async function fetchRecentEvents(): Promise<IEvent[]> {
  const today = todayTime()
  return await getCollection<IEventSchema>({
    path: 'events',
    where: [['date', '>=', lastMonth().toISOString()]],
    orderBy: 'date',
    sortDirection: 'desc'
  }).then((events: IEventSchema[]): IEvent[] =>
    events.map(
      event =>
        ({
          comment: event.comment,
          updatedAt: event.updatedAt,
          date: event.date,
          id: event.id,
          owner: event.owner,
          title: event.title,
          location: event.location,
          formattedDate: formatDate(event.date),
          isUpcoming: getTime(event.date) >= today
        }) as IEvent
    )
  )
}

export async function fetchEvent(eventId: IDocId): Promise<IEvent> {
  const eventDoc = await getDocument<IEventSchema>(`events/${eventId}`)

  const songs: IEventSong[] = await Promise.all(
    eventDoc.songs.map(
      async (eventSong: IEventSongSchema): Promise<IEventSong> => {
        const song: ISong = await fetchSong(eventSong.id)

        const songKey = eventSong.transposeKey || song.key
        const body = transposeAndFormatSong({
          body: song.body,
          fromKey: song.key,
          toKey: songKey
        })

        return {
          id: eventSong.id,
          title: song.title,
          authors: song.authors,
          body,
          key: song.key,
          transposeKey: songKey,
          formattedKey: formatKey(songKey)
        }
      }
    )
  )

  return {
    comment: eventDoc.comment,
    date: eventDoc.date,
    id: eventDoc.id,
    owner: eventDoc.owner,
    title: eventDoc.title,
    location: eventDoc.location,
    songs
  }
}

export async function saveEvent(form: IEvent): Promise<void> {
  if (form.id) {
    await updateDocument<IEventSchema>(`events/${form.id}`, {
      updatedAt: new Date().toISOString(),
      owner: form.owner,
      title: form.title,
      date: form.date,
      comment: form.comment,
      location: form.location || '',
      songs: form.songs
        ? form.songs.map(
            song =>
              ({
                id: song.id,
                transposeKey: song.transposeKey
              }) as IEventSong
          )
        : []
    })
  }
}

export async function createEvent(form: IEvent): Promise<IDocId> {
  const user = (await getAuthState()).user
  const location = getLatestLocation()

  const doc = await createDocument<IEventSchema>('events', {
    title: form.title,
    date: form.date,
    location,
    comment: form.comment,
    songs: form.songs
      ? form.songs.map(
          song =>
            ({
              id: song.id,
              transposeKey: song.transposeKey
            }) as IEventSong
        )
      : [],
    owner: user?.email || '',
    updatedAt: new Date().toISOString()
  })

  return doc.id
}

export async function deleteEvent(id: IDocId) {
  await deleteDocument(`events/${id}`)
}
