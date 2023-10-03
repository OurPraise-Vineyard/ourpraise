import { createAsyncThunk } from '@reduxjs/toolkit'
import { mapDocsId, pruneObject } from '@utils/api'
import { AppDispatch, RootState } from '@state/store'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc
} from 'firebase/firestore'
import { transposeSong } from '@utils/chords'

export const fetchRecentEvents = createAsyncThunk<
  IPartialEvent[],
  void,
  {
    state: RootState
  }
>('events/fetchRecent', function (_, { getState }) {
  return getDocs(query(collection(getFirestore(), 'events'), orderBy('date', 'desc'))).then(docs =>
    mapDocsId(docs)
  )
})

export const fetchEvent = createAsyncThunk<
  IFullEvent,
  string,
  {
    state: RootState
  }
>('events/fetchOne', async function (eventId, { getState }) {
  if (getState().events.index[eventId]) {
    return getState().events.index[eventId]
  } else {
    // Find cached partial event from all events list
    const cached = getState().events.allEvents.find(({ id }) => id === eventId)
    let event: IFullEvent
    if (cached) {
      event = {
        ...cached
      } as IFullEvent
    }

    // Fetch partial event. Used when deep linking to event
    if (!event) {
      event = await getDoc(doc(getFirestore(), `events/${eventId}`)).then(doc =>
        doc.exists()
          ? ({
              ...doc.data(),
              id: doc.id
            } as IFullEvent)
          : null
      )
    }

    // Fetch full songs and fill into event
    event.songs = (
      await Promise.all(
        event.songs.map(async songOptions => {
          let song = getState().songs.index[songOptions.id]

          if (!song) {
            song = await getDoc(doc(getFirestore(), `songs/${songOptions.id}`)).then(doc => {
              if (doc.exists()) {
                return {
                  ...doc.data(),
                  ...songOptions
                }
              }

              return null
            })
          } else {
            song = {
              ...song,
              ...songOptions
            }
          }

          song.body = transposeSong(
            song.body.replace(/^\/\//gm, '  ').replace(/\n\s+?\n/g, '\n\n'),
            song.key,
            song.transposeKey || song.key
          )

          return song
        })
      )
    ).filter(Boolean)

    return event
  }
})

export const saveEvent = createAsyncThunk<
  IPartialEvent,
  IEventForm,
  {
    dispatch: AppDispatch
  }
>('events/save', async event => {
  const options = pruneObject({
    ...event,
    id: undefined,
    songs: event.songs.map(song => ({
      id: song.id,
      transposeKey: song.transposeKey,
      comment: song.comment
    }))
  })

  await setDoc(doc(getFirestore(), `events/${event.id}`), options, { merge: true })

  return {
    ...options,
    id: event.id
  }
})

export const addEvent = createAsyncThunk<
  IPartialEvent,
  IEventForm,
  {
    state: RootState
  }
>('events/add', async (event, { getState }) => {
  const options = pruneObject({
    ...event,
    createdAt: new Date().toISOString(),
    owner: getState().auth.user.email
  })
  const doc = await addDoc(collection(getFirestore(), 'events'), options)

  return {
    ...options,
    id: doc.id
  }
})

export const deleteEvent = createAsyncThunk<
  string,
  IEventForm,
  {
    dispatch: AppDispatch
  }
>('events/delete', async (event, { dispatch }) => {
  await deleteDoc(doc(getFirestore(), `events/${event.id}`))

  return event.id
})
