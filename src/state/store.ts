import { configureStore } from '@reduxjs/toolkit'
import errors from '@state/errorSlice'

const store = configureStore({
  reducer: {
    errors
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

export default store
