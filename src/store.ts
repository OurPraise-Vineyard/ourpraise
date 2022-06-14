import { configureStore } from '@reduxjs/toolkit'
import songs from '@slices/songs'
import events from '@slices/events'
import user from '@slices/user'

const store = configureStore({
  reducer: {
    songs,
    events,
    user
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

declare global {
  interface Window { store }
}

window.store = store

export default store
