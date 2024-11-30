import { fetchSong } from '~/backend/songs'
import {
  createDocument,
  deleteDocument,
  getAndUpdateDocument,
  getCollection,
  getDocument,
  updateDocument
} from '~/lib/database'
import {
  mapCollectionToEvents,
  mapDocToEvent,
  mapEventFormToEvent,
  mapEventSongFormToEventSong
} from '~/mappers/events'
import { formatKey, keysOptions, transposeAndFormatSong } from '~/utils/chords'
import { formatDate, getTime, todayTime } from '~/utils/date'

export type IEventsData = { upcoming: IEvent[]; past: IEvent[] }

export async function fetchEvents(): Promise<IEventsData> {
  const events = await getCollection({
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
  const eventDoc = await getDocument(`events/${eventId}`)

  const songs: IEventSong[] = await Promise.all(
    eventDoc.songs.map(async (eventSong): Promise<IEventSong> => {
      const song: ISong = await fetchSong(eventSong.id)

      const songKey = eventSong.transposeKey || song.key
      const body = transposeAndFormatSong(song.body, song.key, songKey)

      return {
        ...song,
        ...eventSong,
        body,
        transposeKey: songKey,
        formattedKey: formatKey(songKey)
      }
    })
  )

  return {
    comment: eventDoc.comment,
    createdAt: eventDoc.createdAt,
    date: eventDoc.date,
    id: eventDoc.id,
    owner: eventDoc.owner,
    title: eventDoc.title,
    location: eventDoc.location,
    songs,
    formattedDate: formatDate(eventDoc.date)
  }
}

export async function saveEvent(form: IEventForm): Promise<void> {
  await updateDocument(`events/${form.id}`, mapEventFormToEvent(form), {
    merge: true
  })
}

export async function createEvent(form: IEventForm): Promise<IDocId> {
  const doc = await createDocument('events', {
    ...mapEventFormToEvent(form),
    createdAt: new Date().toISOString()
  })

  return doc.id
}

export async function deleteEvent(id: IDocId) {
  await deleteDocument(`events/${id}`)
}

export async function addSongToEvent(eventId: IDocId, songOptions: IEventSong) {
  await getAndUpdateDocument(
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

  await getAndUpdateDocument(
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
  await getAndUpdateDocument(
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
    await getAndUpdateDocument(
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
