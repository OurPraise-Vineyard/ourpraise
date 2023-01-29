import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '@state/store'
import { mapDocsId, pruneObject } from '@utils/api'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where
} from 'firebase/firestore'

export const fetchSongLists = createAsyncThunk<
  SongList[],
  void,
  {
    state: RootState
  }
>('songLists/fetchAll', function (_, { getState }) {
  const orgId = getState().auth.organisation ? getState().auth.organisation.id : null
  return getDocs(
    query(
      collection(getFirestore(), 'songLists'),
      orderBy('lastModified'),
      where('organisation', '==', orgId)
    )
  ).then(mapDocsId)
})

export const fetchSongList = createAsyncThunk<
  FullSongList,
  string,
  {
    state: RootState
  }
>('songLists/fetchOne', async function (songListId, { getState }) {
  if (getState().songLists.index[songListId]) {
    return getState().songLists.index[songListId]
  } else {
    // Find cached partial event from all events list
    const cached = getState().songLists.songLists.find(({ id }) => id === songListId)
    let songList: FullSongList
    if (cached) {
      songList = {
        ...cached
      } as FullSongList
    }

    if (!songList) {
      songList = await getDoc(doc(getFirestore(), `songLists/${songListId}`)).then(doc =>
        doc.exists()
          ? ({
              ...doc.data(),
              id: doc.id
            } as FullSongList)
          : null
      )
    }

    console.log(songList)
    // Fill organisation name
    const org = getState().auth.organisations.find(({ id }) => id === songList.organisation)
    if (org) {
      songList.organisationName = org.name
    } else {
      songList.organisationName = 'No organisation'
    }

    // Fetch full songs and fill into event
    songList.songs = (
      await Promise.all(
        songList.songIds.map(async songId => {
          let song = getState().songs.index[songId]

          if (!song) {
            song = await getDoc(doc(getFirestore(), `songs/${songId}`)).then(doc => {
              if (doc.exists()) {
                return doc.data() as SongType
              }

              return null
            })
          } else {
            song = {
              ...song
            }
          }

          return song
        })
      )
    ).filter(Boolean)

    return songList
  }
})

export const saveSongList = createAsyncThunk<SongList, SongListFormType>(
  'songLists/save',
  async form => {
    const options = pruneObject({
      ...form,
      id: undefined,
      songs: undefined,
      songIds: form.songs.map(song => ({
        id: song.id,
        transpose: song.transpose,
        comment: song.comment
      }))
    })

    await setDoc(doc(getFirestore(), `songLists/${form.id}`), options, { merge: true })

    return {
      ...options,
      id: form.id
    }
  }
)

export const addSongList = createAsyncThunk<
  SongList,
  SongListFormType,
  {
    state: RootState
  }
>('songLists/add', async function (form, { getState }) {
  const orgId = getState().auth.organisation ? getState().auth.organisation.id : null
  const options = pruneObject({
    ...form,
    songs: undefined,
    songIds: form.songs.map(({ id }) => id),
    lastModified: new Date().toISOString(),
    organisation: orgId
  })
  const doc = await addDoc(collection(getFirestore(), 'songLists'), options)
  return {
    ...options,
    id: doc.id
  }
})

export const deleteSongList = createAsyncThunk<string, SongListFormType>(
  'songLists/delete',
  async songlist => {
    await deleteDoc(doc(getFirestore(), `songLists/${songlist.id}`))

    return songlist.id
  }
)
