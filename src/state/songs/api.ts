import { searchSongs } from '@utils/algolia'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { mapDocsId, pruneObject } from '@utils/api'
import { AppDispatch, RootState } from '@state/store'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  updateDoc
} from 'firebase/firestore'
import { resetEventIndex } from '@state/events/slice'

interface SearchResult {
  hits: unknown[]
  query: string
}

export const fetchAllSongs = createAsyncThunk<SongType[]>('songs/fetchAll', function () {
  return getDocs(query(collection(getFirestore(), 'songs'), orderBy('title', 'asc'))).then(docs =>
    mapDocsId(docs)
  )
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
  return getDocs(
    query(collection(getFirestore(), 'songs'), orderBy('createdAt', 'desc'), limit(5))
  ).then(docs => mapDocsId(docs))
})

export const fetchPopularSongs = createAsyncThunk<SongType[]>('home/fetchPopular', async () => {
  return getDocs(
    query(collection(getFirestore(), 'songs'), orderBy('popularity', 'desc'), limit(5))
  ).then(docs => mapDocsId(docs))
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
    cached = await getDoc(doc(getFirestore(), `songs/${songId}`)).then(doc =>
      doc.exists() ? ({ ...doc.data(), id: doc.id } as SongType) : null
    )
  }

  return cached
})

export const saveSong = createAsyncThunk<SongType, SongType, { dispatch: AppDispatch }>(
  'songs/save',
  async (song, { dispatch }) => {
    await updateDoc(
      doc(getFirestore(), `songs/${song.id}`),
      pruneObject({ ...song, id: undefined })
    )
    await dispatch(resetEventIndex())

    return song
  }
)

export const addSong = createAsyncThunk<SongType, SongType>('songs/add', async song => {
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

export const deleteSong = createAsyncThunk<string, SongType, { dispatch: AppDispatch }>(
  'songs/delete',
  async (song, { dispatch }) => {
    await deleteDoc(doc(getFirestore(), `songs/${song.id}`))
    await dispatch(resetEventIndex())

    return song.id
  }
)
