import { createSlice } from '@reduxjs/toolkit'
import { addEvent, deleteEvent, fetchEvent, fetchRecentEvents, saveEvent } from '@state/events/api'
import { FetchStatus } from '@utils/api'

export interface EventsState {
  allEvents: PartialEvent[]
  statusAllEvents: FetchStatus
  index: Record<string, FullEvent>
}

const initialState: EventsState = {
  allEvents: [],
  statusAllEvents: FetchStatus.idle,
  index: {}
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    resetEventIndex: state => {
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
