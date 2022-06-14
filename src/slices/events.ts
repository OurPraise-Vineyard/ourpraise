import { mapDocsId, pruneObject } from '@api/utils'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { removeEventSongs } from '@slices/songs'
import { FetchStatus } from '@slices/utils'
import { AppDispatch, RootState } from '@store'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc } from 'firebase/firestore'

export interface EventsState {
  allEvents: EventType[],
  statusAllEvents: FetchStatus,
  index: Record<string, EventType>
}

const initialState: EventsState = {
  allEvents: [],
  statusAllEvents: FetchStatus.idle,
  index: {}
}

export const fetchRecentEvents = createAsyncThunk<EventType[]>('events/fetchRecent', function () {
  return getDocs(query(collection(getFirestore(), 'events'), orderBy('date', 'desc')))
    .then(docs => mapDocsId(docs))
})

export const fetchEvent = createAsyncThunk<
  EventType,
  string,
  {
    state: RootState
  }
>('events/fetchOne', async function (eventId, { getState }) {
  let cached: EventType = getState().events.index[eventId]
  if (!cached) {
    cached = await getDoc(doc(getFirestore(), `events/${eventId}`))
      .then(doc => doc.exists() ? ({
        ...doc.data(),
        id: doc.id
      } as EventType) : null)
  }

  return cached
})

export const saveEvent = createAsyncThunk<
  EventType,
  EventType,
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

  await updateDoc(doc(getFirestore(), `events/${event.id}`), options)

  await dispatch(removeEventSongs(event.id))

  return {
    ...options,
    id: event.id
  }
})

export const addEvent = createAsyncThunk<
  EventType,
  EventType
>('events/add', async (event) => {
  const options = pruneObject({
    ...event,
    createdAt: new Date().toISOString()
  })
  const doc = await addDoc(collection(getFirestore(), 'events'), options)

  return {
    ...options,
    id: doc.id
  }
})

export const deleteEvent = createAsyncThunk<
  string,
  EventType,
  {
    dispatch: AppDispatch
  }
>('events/delete', async (event, { dispatch }) => {
  await deleteDoc(doc(getFirestore(), `events/${event.id}`))
  await dispatch(removeEventSongs(event.id))

  return event.id
})

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchRecentEvents.pending, state => {
        state.statusAllEvents = FetchStatus.loading
      })
      .addCase(fetchRecentEvents.rejected, state => {
        state.statusAllEvents = FetchStatus.failed
      })
      .addCase(fetchRecentEvents.fulfilled, (state, action) => {
        state.statusAllEvents = FetchStatus.succeeded
        state.allEvents = action.payload
        action.payload.forEach(event => {
          state.index[event.id] = event
        })
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        if (action.payload) {
          state.index[action.payload.id] = action.payload
        }
      })
      .addCase(saveEvent.fulfilled, (state, action) => {
        state.index[action.payload.id] = action.payload
        const index = state.allEvents.findIndex(({ id }) => id === action.payload.id)
        if (index > -1) {
          state.allEvents[index] = action.payload
        }
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.index[action.payload.id] = action.payload
        state.allEvents = []
        state.statusAllEvents = FetchStatus.idle
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        delete state.index[action.payload]
        state.allEvents = state.allEvents.filter(({ id }) => id !== action.payload)
      })
  }
})

export default eventsSlice.reducer
