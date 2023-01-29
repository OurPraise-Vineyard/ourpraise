import { configureStore } from '@reduxjs/toolkit'
import songs, { reset as resetSongs } from '@state/songs/slice'
import events, { reset as resetEvents } from '@state/events/slice'
import songLists, { reset as resetSonglists } from '@state/songLists/slice'
import auth from '@state/auth/slice'
import errors from '@state/errorSlice'

const store = configureStore({
  reducer: {
    songs,
    events,
    auth,
    errors,
    songLists
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

declare global {
  interface Window {
    store
  }
}

window.store = store

export const resetState = () => {
  store.dispatch(resetEvents())
  store.dispatch(resetSonglists())
  store.dispatch(resetSongs())
}

export default store
