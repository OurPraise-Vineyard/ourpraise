import { fetchSong } from '@backend/songs'
import Backend from '@lib/backend'
import {
  mapCollectionToEvents,
  mapDocToEvent,
  mapEventFormToEvent,
  mergeSongEventSong
} from '@mappers/events'
import { getTime, todayTime } from '@utils/date'

export type IEventsData = { upcoming: IEvent[]; past: IEvent[] }

export async function fetchEvents(): Promise<IEventsData> {
  const events = await Backend.getCollection({
    path: 'events',
    orderBy: 'date',
    sortDirection: 'desc'
  }).then(mapCollectionToEvents)

  const upcoming: IEvent[] = []
  const past: IEvent[] = []
  const today = todayTime()

  for (const ev of events) {
    if (getTime(ev.date) >= today) {
      upcoming.push(ev)
    } else if (past.length < 8) {
      past.push(ev)
    }
  }

  return {
    upcoming,
    past
  }
}

export async function fetchEvent(eventId: IDocId): Promise<IEvent> {
  const event = await Backend.getDoc(`events/${eventId}`).then(mapDocToEvent)

  const songs: IEventSong[] = await Promise.all(
    event.songs.map(async eventSong => {
      const song: ISong = await fetchSong(eventSong.id)

      return mergeSongEventSong(song, eventSong)
    })
  )

  return {
    ...event,
    songs
  }
}

export async function saveEvent(form: IEventForm): Promise<void> {
  await Backend.setDoc(`events/${form.id}`, mapEventFormToEvent(form), { merge: true })
}

export async function createEvent(form: IEventForm): Promise<IDocId> {
  const doc = await Backend.createDoc('events', {
    ...mapEventFormToEvent(form),
    createdAt: new Date().toISOString(),
    owner: 'MISSING OWNER'
  })

  return doc.id
}

export async function deleteEvent(id: IDocId) {
  await Backend.deleteDoc(`events/${id}`)
}
