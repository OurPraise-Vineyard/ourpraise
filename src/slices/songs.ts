import { searchSongs } from '@api/algolia'
import { mapDocsId, pruneObject } from '@api/utils'
import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchEvent } from '@slices/events'
import { FetchStatus } from '@slices/utils'
import { AppDispatch, RootState } from '@store'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, updateDoc } from 'firebase/firestore'

export interface SongsState {
  searchCache: Record<string, unknown[]>,
  searchResults: unknown[],
  index: Record<string, SongType>,
  views: {
    [key: string]: SongType[],
    all: SongType[],
    recent: SongType[],
    popular: SongType[]
  },
  status: {
    all: FetchStatus,
    recent: FetchStatus,
    popular: FetchStatus
  }
}

interface SearchResult {
  hits: unknown[],
  query: string
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

export const fetchRecentSongs = createAsyncThunk<SongType[]>('home/fetchRecent', () => {
  return getDocs(query(collection(getFirestore(), 'songs'), orderBy('createdAt', 'desc'), limit(5)))
    .then(docs => mapDocsId(docs))
})

export const fetchPopularSongs = createAsyncThunk<SongType[]>('home/fetchPopular', async () => {
  return getDocs(query(collection(getFirestore(), 'songs'), orderBy('popularity', 'desc'), limit(5)))
    .then(docs => mapDocsId(docs))
})

export const fetchEventSongs = createAsyncThunk<
  {
    eventId: string,
    songs: SongType[]
  },
  string,
  {
    state: RootState,
    dispatch: AppDispatch
  }
>('songs/fetchEventSongs', async (eventId, { getState, dispatch }) => {
  const cached = getState().songs.views[`event_${eventId}`]
  if (cached) {
    return {
      songs: cached,
      eventId
    }
  }

  const event: EventType = (await dispatch(fetchEvent(eventId))).payload as EventType

  const songs =  await Promise.all(
    event.songs.map(
      async song => {
        let cached: SongType = getState().songs.index[song.id]

        if (!cached) {
          cached = await getDoc(doc(getFirestore(), `songs/${song.id}`))
            .then(doc => ({
              ...(doc.data() as SongType),
              ...song
            }))
        } else {
          cached = {
            ...cached,
            ...song
          }
        }

        return cached
      }
    )
  )

  return {
    eventId,
    songs
  }
})

export const fetchSong = createAsyncThunk<
SongType,
string,
{
  state: RootState
}
>('home/fetchSong', async (songId, { getState }) => {
  let cached = getState().songs.index[songId]

  if (!cached) {
    cached = await getDoc(doc(getFirestore(), `songs/${songId}`))
      .then(doc => doc.exists() ? ({ ...doc.data(), id: doc.id } as SongType) : null)
  }

  return cached
})

export const saveSong = createAsyncThunk<SongType, SongType>('songs/save', async (song) => {
  await updateDoc(doc(getFirestore(), `songs/${song.id}`), pruneObject({ ...song, id: undefined }))

  return song
})

export const addSong = createAsyncThunk<SongType, SongType>('songs/add', async (song) => {
  const options = pruneObject({
    ...song,
    createdAt: new Date().toISOString(),
    id: undefined
  })
  const doc = await addDoc(collection(getFirestore(), 'songs'), options)

  return {
    ...options,
    id: doc.id
  }
})

export const deleteSong = createAsyncThunk<string, SongType>('songs/delete', async (song) => {
  await deleteDoc(doc(getFirestore(), `songs/${song.id}`))

  return song.id
})

function buildViewReducer (builder, name: string, asyncThunk: AsyncThunk<SongType[], void, unknown>) {
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
    removeEventSongs(state, action: PayloadAction<string>) {
      delete state.views[`event_${action.payload}`]
    }
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
      .addCase(fetchEventSongs.fulfilled, (state, action) => {
        state.views[`event_${action.payload.eventId}`] = action.payload.songs
        action.payload.songs.forEach(song => {
          state.index[song.id] = song
        })
      })
      .addCase(fetchSong.fulfilled, (state, action) => {
        if (action.payload) {
          state.index[action.payload.id] = action.payload
        }
      })
      .addCase(saveSong.fulfilled, (state, action) => {
        state.index[action.payload.id] = action.payload
        Object.values(state.views).forEach((songs) => {
          const index = songs.findIndex(({ id }) => id === action.payload.id)
          if (index > -1) {
            songs[index] = action.payload
          }
        })
      })
      .addCase(deleteSong.fulfilled, (state, action) => {
        delete state.index[action.payload]
        state.views = Object.entries(state.views).reduce((acc, [key, songs]) => ({
          ...acc,
          [key]: songs.filter(({ id }) => id !== action.payload)
        }), state.views)
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

export const { removeEventSongs } = songsSlice.actions

export default songsSlice.reducer
