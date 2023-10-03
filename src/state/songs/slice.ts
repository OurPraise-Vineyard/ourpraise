import { AsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchStatus } from '@utils/api'
import {
  addSong,
  deleteSong,
  fetchAllSongs,
  fetchPopularSongs,
  fetchRecentSongs,
  fetchSearchQuery,
  fetchSong,
  saveSong
} from '@state/songs/api'

export interface SongsState {
  searchCache: Record<string, unknown[]>
  searchResults: unknown[]
  index: Record<string, ISong>
  views: {
    [key: string]: ISong[]
    all: ISong[]
    recent: ISong[]
    popular: ISong[]
  }
  status: {
    all: FetchStatus
    recent: FetchStatus
    popular: FetchStatus
  }
}

const initialState: SongsState = {
  index: {},
  searchCache: {},
  searchResults: [],
  views: {
    all: [],
    recent: [],
    popular: []
  },
  status: {
    all: FetchStatus.idle,
    recent: FetchStatus.idle,
    popular: FetchStatus.idle
  }
}

function buildViewReducer(builder, name: string, asyncThunk: AsyncThunk<ISong[], void, unknown>) {
  builder
    .addCase(asyncThunk.pending, state => {
      state.status[name] = FetchStatus.loading
    })
    .addCase(asyncThunk.rejected, state => {
      state.status[name] = FetchStatus.failed
    })
    .addCase(asyncThunk.fulfilled, (state, action) => {
      state.status[name] = FetchStatus.succeeded
      state.views[name] = action.payload
      action.payload.forEach(song => {
        state.index[song.id] = song
      })
    })
}

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers(builder) {
    buildViewReducer(builder, 'all', fetchAllSongs)
    buildViewReducer(builder, 'recent', fetchRecentSongs)
    buildViewReducer(builder, 'popular', fetchPopularSongs)
    builder
      .addCase(fetchSearchQuery.rejected, state => {
        state.searchResults = []
      })
      .addCase(fetchSearchQuery.fulfilled, (state, action) => {
        state.searchResults = action.payload.hits
        state.searchCache[action.payload.query] = action.payload.hits
      })
      .addCase(fetchSong.fulfilled, (state, action) => {
        if (action.payload) {
          state.index[action.payload.id] = action.payload
        }
      })
      .addCase(saveSong.fulfilled, (state, action) => {
        state.index[action.payload.id] = action.payload
        Object.values(state.views).forEach(songs => {
          const index = songs.findIndex(({ id }) => id === action.payload.id)
          if (index > -1) {
            songs[index] = action.payload
          }
        })
      })
      .addCase(deleteSong.fulfilled, (state, action) => {
        delete state.index[action.payload]
        state.views = Object.entries(state.views).reduce(
          (acc, [key, songs]) => ({
            ...acc,
            [key]: songs.filter(({ id }) => id !== action.payload)
          }),
          state.views
        )
      })
      .addCase(addSong.fulfilled, (state, action) => {
        state.index[action.payload.id] = action.payload
        Object.keys(state.status).forEach(key => {
          state.status[key] = FetchStatus.idle
          state.views[key] = []
        })
      })
  }
})

export const { reset } = songsSlice.actions

export default songsSlice.reducer
