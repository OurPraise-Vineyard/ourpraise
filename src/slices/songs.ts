import { searchSongs } from '@api/algolia'
import { mapDocsId } from '@api/utils'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FetchStatus } from '@slices/utils'
import { RootState } from '@store'
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'

export interface SongsState {
  searchCache: Record<string, unknown[]>,
  searchResults: unknown[],
  allSongs: SongType[],
  statusAllSongs: FetchStatus,
  statusSearch: FetchStatus
}

interface SearchResult {
  hits: unknown[],
  query: string
}

const initialState: SongsState = {
  searchCache: {},
  searchResults: [],
  allSongs: [],
  statusAllSongs: FetchStatus.idle,
  statusSearch: FetchStatus.idle
}

export const fetchAllSongs = createAsyncThunk<SongType[]>('songs/fetchAll', function () {
  return getDocs(query(collection(getFirestore(), 'songs'), orderBy('title', 'asc')))
    .then(docs => mapDocsId(docs))
})

export const fetchSearchQuery = createAsyncThunk<
  SearchResult,
  string,
  {
    state: RootState
  }
>('songs/fetchSearchQuery', async function (query, { getState }) {
  if (getState().songs.searchCache[query]) {
    return {
      query,
      hits: getState().songs.searchCache[query]
    }
  } else {
    const result = await searchSongs(query)
    return {
      query,
      hits: result.map(hit => ({
        ...hit,
        id: hit.objectID
      }))
    }
  }
})

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    setSearchStatus(state, action: PayloadAction<FetchStatus>) {
      state.statusSearch = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllSongs.pending, state => {
        state.statusAllSongs = FetchStatus.loading
      })
      .addCase(fetchAllSongs.rejected, state => {
        state.statusAllSongs = FetchStatus.failed
      })
      .addCase(fetchAllSongs.fulfilled, (state, action) => {
        state.statusAllSongs = FetchStatus.succeeded
        state.allSongs = action.payload
      })
      .addCase(fetchSearchQuery.pending, state => {
        state.statusSearch = FetchStatus.loading
      })
      .addCase(fetchSearchQuery.rejected, state => {
        state.statusSearch = FetchStatus.failed
        state.searchResults = []
      })
      .addCase(fetchSearchQuery.fulfilled, (state, action) => {
        state.statusSearch = FetchStatus.succeeded
        state.searchResults = action.payload.hits
        state.searchCache[action.payload.query] = action.payload.hits
      })
  }
})

export const { setSearchStatus } = songsSlice.actions

export default songsSlice.reducer
