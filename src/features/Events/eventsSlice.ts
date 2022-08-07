import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchStatus, mapDocsId, pruneObject } from '@utils/api'
import { AppDispatch, RootState } from '@store'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, setDoc, where } from 'firebase/firestore'

export interface EventsState {
  allEvents: PartialEvent[],
  statusAllEvents: FetchStatus,
  index: Record<string, FullEvent>
}

const initialState: EventsState = {
  allEvents: [],
  statusAllEvents: FetchStatus.idle,
  index: {}
}

export const fetchRecentEvents = createAsyncThunk<
  PartialEvent[],
  void,
  {
    state: RootState
  }
>('events/fetchRecent', function (_, { getState }) {
  const orgId = getState().auth.organisation ? getState().auth.organisation.id : null
  return getDocs(query(collection(getFirestore(), 'events'), orderBy('date', 'desc'), where('organisation', '==', orgId)))
    .then(docs => mapDocsId(docs))
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
      event = await getDoc(doc(getFirestore(), `events/${eventId}`))
        .then(doc => doc.exists() ? ({
          ...doc.data(),
          id: doc.id
        } as FullEvent) : null)
    }

    // Fill organisation name
    const org = getState().auth.organisations.find(({ id }) => id === event.organisation)
    if (org) {
      event.organisationName = org.name
    } else {
      event.organisationName = 'No organisation'
    }

    // Fetch full songs and fill into event
    event.songs =  (await Promise.all(
      event.songs.map(
        async songOptions => {
          let song = getState().songs.index[songOptions.id]

          if (!song) {
            song = await getDoc(doc(getFirestore(), `songs/${songOptions.id}`))
              .then(doc => {
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
        }
      )
    )).filter(Boolean)

    event.songsIndex = event.songs.reduce((acc, song) => ({
      ...acc,
      [song.id]: song
    }), {})

    return event
  }
})

export const saveEvent = createAsyncThunk<
  PartialEvent,
  EventFormType,
  {
    dispatch: AppDispatch
  }
>('events/save', async (event , { dispatch }) => {
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

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    resetEventIndex: (state) => {
      state.index = {}
    },
    reset: () => initialState
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRecentEvents.pending, state => {
        state.statusAllEvents = FetchStatus.loading
      })
      .addCase(fetchRecentEvents.rejected, (state, action) => {
        state.statusAllEvents = FetchStatus.failed
        console.log(action.error.stack)
      })
      .addCase(fetchRecentEvents.fulfilled, (state, action) => {
        state.statusAllEvents = FetchStatus.succeeded
        state.allEvents = action.payload
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        if (action.payload) {
          state.index[action.payload.id] = action.payload
        }
      })
      .addCase(saveEvent.fulfilled, (state, action) => {
        delete state.index[action.payload.id]
        const index = state.allEvents.findIndex(({ id }) => id === action.payload.id)
        if (index > -1) {
          state.allEvents[index] = action.payload
        }
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.allEvents = [...state.allEvents, action.payload].sort((a, b) => {
          if (a.date < b.date) {
            return -1
          } else if (a.date > b.date) {
            return 1
          }
          return 0
        })
        state.statusAllEvents = FetchStatus.idle
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        delete state.index[action.payload]
        state.allEvents = state.allEvents.filter(({ id }) => id !== action.payload)
      })
  }
})

export const { reset, resetEventIndex } = eventsSlice.actions

export default eventsSlice.reducer
