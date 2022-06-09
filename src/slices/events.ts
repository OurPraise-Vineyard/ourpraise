import { mapDocsId } from '@api/utils'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchStatus } from '@slices/utils'
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'

export interface EventsState {
  allEvents: EventType[],
  statusAllEvents: FetchStatus
}

const initialState: EventsState = {
  allEvents: [],
  statusAllEvents: FetchStatus.idle
}

export const fetchRecentEvents = createAsyncThunk('events/fetchRecent', function () {
  return getDocs(query(collection(getFirestore(), 'events'), orderBy('date', 'desc')))
    .then(docs => mapDocsId(docs))
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
        state.allEvents = []
      })
      .addCase(fetchRecentEvents.fulfilled, (state, action) => {
        state.statusAllEvents = FetchStatus.succeeded
        state.allEvents = action.payload
      })
  }
})

export default eventsSlice.reducer
