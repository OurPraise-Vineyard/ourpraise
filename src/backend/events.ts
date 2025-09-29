import { eventCache as cache } from '~/backend/cache'
import { fetchSong } from '~/backend/songs'
import type {
  IDocId,
  IEvent,
  IEventSchema,
  IEventSong,
  IEventSongSchema,
  ISong
} from '~/types'
import { transposeAndFormatSong } from '~/utils/chords'
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

const recentEventsCollectionKey = 'recentEvents'

export async function fetchRecentEvents(): Promise<IEvent[]> {
  const cached = cache.getCollection(recentEventsCollectionKey)
  const today = todayTime()
  const mapper = (events: IEventSchema[]): IEvent[] =>
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

  if (cached.length > 0) {
    return mapper(cached)
  }

  const collection = await getCollection<IEventSchema>({
    path: 'events',
    where: [['date', '>=', lastMonth().toISOString()]],
    orderBy: 'date',
    sortDirection: 'desc'
  })

  cache.setCollection(
    recentEventsCollectionKey,
    collection.map(item => item.id)
  )
  collection.forEach(item => cache.setDocument(item.id, item))

  return mapper(collection)
}

export async function fetchEvent(eventId: IDocId): Promise<IEvent> {
  let event = cache.getDocument(eventId)

  if (!event) {
    event = await getDocument<IEventSchema>(`events/${eventId}`)
    cache.setDocument(event.id, event)
  }

  const songs: IEventSong[] = await Promise.all(
    event.songs.map(
      async (eventSong: IEventSongSchema): Promise<IEventSong | null> => {
        let song: ISong

        try {
          song = await fetchSong(eventSong.id)
        } catch {
          return null
        }

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
          transposeKey: songKey
        }
      }
    )
  ).then(songs => songs.filter(Boolean) as IEventSong[])

  return {
    comment: event.comment,
    date: event.date,
    id: event.id,
    owner: event.owner,
    title: event.title,
    location: event.location,
    songs
  }
}

export async function saveEvent(form: IEvent): Promise<void> {
  if (form.id) {
    const options = {
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
    }
    await updateDocument<IEventSchema>(`events/${form.id}`, options)

    cache.setDocument(form.id, { id: form.id, ...options })
  }
}

export async function createEvent(form: IEvent): Promise<IDocId> {
  const user = (await getAuthState()).user
  const location = getLatestLocation()
  const event = {
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
  }

  const doc = await createDocument<IEventSchema>('events', event)

  cache.setDocument(doc.id, { ...event, id: doc.id })
  cache.deleteCollection(recentEventsCollectionKey)

  return doc.id
}

export async function deleteEvent(id: IDocId) {
  await deleteDocument(`events/${id}`)
  cache.deleteDocument(id)
}
