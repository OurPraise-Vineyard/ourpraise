import { mapDocsId } from '@api/utils'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { collection, getDocs, getFirestore, limit, orderBy, query } from 'firebase/firestore'

export interface HomeState {
  recentSongs: SongType[],
  popularSongs: SongType[],
  statusRecent: string,
  statusPopular: string
}

const initialState: HomeState = {
  recentSongs: [],
  popularSongs: [],
  statusRecent: 'idle',
  statusPopular: 'idle'
}

export const fetchRecentSongs = createAsyncThunk<SongType[]>('home/fetchRecent', () => {
  return getDocs(query(collection(getFirestore(), 'songs'), orderBy('createdAt', 'desc'), limit(5)))
    .then(docs => mapDocsId(docs))
})

export const fetchPopularSongs = createAsyncThunk<SongType[]>('home/fetchPopular', async () => {
  return getDocs(query(collection(getFirestore(), 'songs'), orderBy('popularity', 'desc'), limit(5)))
    .then(docs => mapDocsId(docs))
})

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchRecentSongs.pending, (state) => {
        state.statusRecent = 'loading'
      })
      .addCase(fetchRecentSongs.fulfilled, (state, action) => {
        state.statusRecent = 'succeeded'
        state.recentSongs = action.payload
      })
      .addCase(fetchRecentSongs.rejected, (state) => {
        state.statusRecent = 'failed'
      })
      .addCase(fetchPopularSongs.pending, (state) => {
        state.statusPopular = 'loading'
      })
      .addCase(fetchPopularSongs.fulfilled, (state, action) => {
        state.statusPopular = 'succeeded'
        state.popularSongs = action.payload
      })
      .addCase(fetchPopularSongs.rejected, (state) => {
        state.statusPopular = 'failed'
      })
  }
})

export default homeSlice.reducer
