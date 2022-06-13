import { mapDocsId } from '@api/utils'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchStatus } from '@slices/utils'
import { RootState } from '@store'
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'

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
      .then(doc => ({
        ...doc.data(),
        id: doc.id
      } as EventType))
  }

  return cached
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
        state.index[action.payload.id] = action.payload
      })
  }
})

export default eventsSlice.reducer
