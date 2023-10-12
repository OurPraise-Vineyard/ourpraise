import { fetchSong } from '@backend/songs'
import Backend from '@lib/backend'
import {
  mapCollectionToEvents,
  mapDocToEvent,
  mapEventFormToEvent,
  mapEventSongFormToEventSong,
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
  await Backend.setDoc(`events/${form.id}`, mapEventFormToEvent(form), {
    merge: true
  })
}

export async function createEvent(form: IEventForm): Promise<IDocId> {
  const doc = await Backend.createDoc('events', {
    ...mapEventFormToEvent(form),
    createdAt: new Date().toISOString()
  })

  return doc.id
}

export async function deleteEvent(id: IDocId) {
  await Backend.deleteDoc(`events/${id}`)
}

export async function addSongToEvent(eventId: IDocId, songOptions: IEventSong) {
  await Backend.getAndSetDoc(
    `events/${eventId}`,
    (data: IDoc) => {
      const songs = (data as IEvent).songs
      if (songs.find(song => song.id === songOptions.id)) {
        throw new Error('Song already added')
      }
      return {
        songs: [
          ...songs,
          {
            id: songOptions.id,
            transposeKey: songOptions.transposeKey,
            comment: songOptions.comment
          }
        ]
      }
    },
    {
      merge: true
    }
  )
}

export async function saveEventSong(eventId: IDocId, form: IEventSongForm) {
  const eventSong = mapEventSongFormToEventSong(form)

  await Backend.getAndSetDoc(
    `events/${eventId}`,
    (data: IDoc) => {
      return {
        songs: (data as IEvent).songs.map(song => {
          if (song.id === eventSong.id) {
            return {
              ...song,
              ...eventSong
            }
          }
          return song
        })
      }
    },
    {
      merge: true
    }
  )
}

export async function removeEventSong(eventId: IDocId, removeId: IDocId) {
  await Backend.getAndSetDoc(
    `events/${eventId}`,
    (data: IDoc) => ({
      songs: (data as IEvent).songs.filter(song => song.id !== removeId)
    }),
    {
      merge: true
    }
  )
}

export async function moveEventSong(
  eventId: IDocId,
  moveId: IDocId,
  steps: number
) {
  if (steps !== 0) {
    await Backend.getAndSetDoc(
      `events/${eventId}`,
      (data: IDoc) => {
        const songs = (data as IEvent).songs
        const index = songs.findIndex(song => song.id === moveId)
        if (index + steps >= 0 && index + steps <= songs.length - 1) {
          const moveSong = songs.splice(index, 1)[0]
          songs.splice(index + steps, 0, moveSong)
          return {
            songs
          }
        }
      },
      {
        merge: true
      }
    )
  }
}
