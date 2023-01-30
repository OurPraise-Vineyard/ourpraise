import { createSlice } from '@reduxjs/toolkit'
import {
  addSongList,
  deleteSongList,
  fetchSongList,
  fetchSongLists,
  saveSongList
} from '@state/songLists/api'
import { FetchStatus } from '@utils/api'

function sortLastModified(a, b) {
  if (a.lastModified < b.lastModified) {
    return 1
  } else if (a.lastModified > b.lastModified) {
    return -1
  }
  return 0
}

interface SongListsState {
  songLists: SongList[]
  statusSongLists: FetchStatus
  index: Record<string, FullSongList>
}

const initialState: SongListsState = {
  songLists: [],
  statusSongLists: FetchStatus.idle,
  index: {}
}

const songListsSlice = createSlice({
  name: 'songLists',
  initialState,
  reducers: {
    resetSongListsIndex: state => {
      state.index = {}
    },
    reset: () => initialState
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSongLists.pending, state => {
        state.statusSongLists = FetchStatus.loading
      })
      .addCase(fetchSongLists.rejected, (state, action) => {
        state.statusSongLists = FetchStatus.failed
        console.log(action.error.stack)
      })
      .addCase(fetchSongLists.fulfilled, (state, action) => {
        state.statusSongLists = FetchStatus.succeeded
        state.songLists = action.payload
      })
      .addCase(fetchSongList.fulfilled, (state, action) => {
        if (action.payload) {
          state.index[action.payload.id] = action.payload
        }
      })
      .addCase(saveSongList.fulfilled, (state, action) => {
        delete state.index[action.payload.id]
        const index = state.songLists.findIndex(({ id }) => id === action.payload.id)
        if (index > -1) {
          state.songLists[index] = { ...state.songLists[index], ...action.payload }
        }
        state.songLists = state.songLists.sort(sortLastModified)
      })
      .addCase(addSongList.fulfilled, (state, action) => {
        state.songLists = [...state.songLists, action.payload].sort(sortLastModified)
        state.statusSongLists = FetchStatus.idle
      })
      .addCase(deleteSongList.fulfilled, (state, action) => {
        delete state.index[action.payload]
        state.songLists = state.songLists.filter(({ id }) => id !== action.payload)
      })
  }
})

export const { reset, resetSongListsIndex } = songListsSlice.actions

export default songListsSlice.reducer
