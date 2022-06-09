import { configureStore } from '@reduxjs/toolkit'
import home from '@slices/home'
import songs from '@slices/songs'
import events from '@slices/events'

const store = configureStore({
  reducer: {
    home,
    songs,
    events
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

declare global {
  interface Window { store }
}

window.store = store

export default store
