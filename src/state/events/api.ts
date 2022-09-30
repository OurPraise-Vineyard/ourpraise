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
  setDoc,
  where
} from 'firebase/firestore'

export const fetchRecentEvents = createAsyncThunk<
  PartialEvent[],
  void,
  {
    state: RootState
  }
>('events/fetchRecent', function (_, { getState }) {
  const orgId = getState().auth.organisation ? getState().auth.organisation.id : null
  return getDocs(
    query(
      collection(getFirestore(), 'events'),
      orderBy('date', 'desc'),
      where('organisation', '==', orgId)
    )
  ).then(docs => mapDocsId(docs))
})

export const fetchEvent = createAsyncThunk<
  FullEvent,
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
    let event: FullEvent
    if (cached) {
      event = {
        ...cached
      } as FullEvent
    }

    // Fetch partial event. Used when deep linking to event
    if (!event) {
      event = await getDoc(doc(getFirestore(), `events/${eventId}`)).then(doc =>
        doc.exists()
          ? ({
              ...doc.data(),
              id: doc.id
            } as FullEvent)
          : null
      )
    }

    // Fill organisation name
    const org = getState().auth.organisations.find(({ id }) => id === event.organisation)
    if (org) {
      event.organisationName = org.name
    } else {
      event.organisationName = 'No organisation'
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

          return song
        })
      )
    ).filter(Boolean)

    event.songsIndex = event.songs.reduce(
      (acc, song) => ({
        ...acc,
        [song.id]: song
      }),
      {}
    )

    return event
  }
})

export const saveEvent = createAsyncThunk<
  PartialEvent,
  EventFormType,
  {
    dispatch: AppDispatch
  }
>('events/save', async (event, { dispatch }) => {
  const options = pruneObject({
    ...event,
    id: undefined,
    songs: event.songs.map(song => ({
      id: song.id,
      transpose: song.transpose,
      comment: song.comment
    }))
  })

  await setDoc(doc(getFirestore(), `events/${event.id}`), options)

  return {
    ...options,
    id: event.id
  }
})

export const addEvent = createAsyncThunk<
  PartialEvent,
  EventFormType,
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
  EventFormType,
  {
    dispatch: AppDispatch
  }
>('events/delete', async (event, { dispatch }) => {
  await deleteDoc(doc(getFirestore(), `events/${event.id}`))

  return event.id
})
