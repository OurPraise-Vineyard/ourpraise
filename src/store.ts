import { configureStore } from '@reduxjs/toolkit'
import songs, { reset as resetSongs } from '@features/Songs/songsSlice'
import events, { reset as resetEvents } from '@features/Events/eventsSlice'
import auth from '@features/Auth/authSlice'
import errors from '@utils/errorSlice'

const store = configureStore({
  reducer: {
    songs,
    events,
    auth,
    errors
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

declare global {
  interface Window { store }
}

window.store = store

export const resetState = () => {
  store.dispatch(resetEvents())
  store.dispatch(resetSongs())
}

export default store
