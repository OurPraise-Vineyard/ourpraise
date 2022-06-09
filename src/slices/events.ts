import { mapDocsId } from '@api/utils'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchStatus } from '@slices/utils'
import { RootState } from '@store'
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'

export interface EventsState {
  allEvents: EventType[],
  statusAllEvents: FetchStatus,
  fullEvents: Record<string, EventType>,
  statusEvent: FetchStatus
}

const initialState: EventsState = {
  allEvents: [],
  statusAllEvents: FetchStatus.idle,
  fullEvents: {},
  statusEvent: FetchStatus.idle
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
  let event: EventType = getState().events.allEvents.find(({ id }) => id === eventId)
  if (!event) {
    event = await getDoc(doc(getFirestore(), `events/${eventId}`))
      .then(doc => ({
        ...doc.data(),
        id: doc.id
      } as EventType))
  }

  const songs = await Promise.all(
    event.songs.map(
      async song => {
        let cached: SongType = getState().songs.allSongs.find(({ id }) => id === song.id)

        if (!cached) {
          cached = await getDoc(doc(getFirestore(), `songs/${song.id}`))
            .then(doc => ({
              ...doc.data(),
              ...song
            } as SongType))
        } else {
          cached = {
            ...cached,
            ...song
          }
        }

        return cached
      }
    )
  )

  return {
    ...event,
    songs
  }
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
      })
      .addCase(fetchEvent.pending, state => {
        state.statusEvent = FetchStatus.loading
      })
      .addCase(fetchEvent.rejected, state => {
        state.statusEvent = FetchStatus.failed
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.statusEvent = FetchStatus.succeeded
        state.fullEvents[action.payload.id] = action.payload
      })
  }
})

export default eventsSlice.reducer
