import { fetchSong } from '~/backend/songs'
import type {
  IDocId,
  IEvent,
  IEventSchema,
  IEventSong,
  IEventSongSchema,
  ISong
} from '~/types'
import { DatabaseCache } from '~/utils/cache'
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

const cache = new DatabaseCache<IEventSchema>()
const eventCollectionKey = 'events'
const recentEventsCollectionKey = 'recentEvents'

export async function fetchEvents(): Promise<IEvent[]> {
  const cached = cache.getCollection(eventCollectionKey)
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
    orderBy: 'date',
    sortDirection: 'desc'
  })

  cache.setCollection(
    eventCollectionKey,
    collection.map(item => item.id)
  )
  collection.forEach(item => cache.setDocument(item.id, item))

  return mapper(collection)
}

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
  const cached = cache.getDocument(eventId)
  if (cached) {
    const songs: IEventSong[] = await Promise.all(
      cached.songs.map(
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
            transposeKey: songKey
          }
        }
      )
    )

    return {
      comment: cached.comment,
      date: cached.date,
      id: cached.id,
      owner: cached.owner,
      title: cached.title,
      location: cached.location,
      songs
    }
  }

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
          transposeKey: songKey
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
  cache.deleteCollection(eventCollectionKey)
  cache.deleteCollection(recentEventsCollectionKey)

  return doc.id
}

export async function deleteEvent(id: IDocId) {
  await deleteDocument(`events/${id}`)
  cache.deleteDocument(id)
}
