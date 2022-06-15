import { configureStore } from '@reduxjs/toolkit'
import songs from '@features/Songs/songsSlice'
import events from '@features/Events/eventsSlice'
import auth from '@features/Auth/authSlice'

const store = configureStore({
  reducer: {
    songs,
    events,
    auth
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

declare global {
  interface Window { store }
}

window.store = store

export default store
