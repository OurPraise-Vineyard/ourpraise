interface SongList {
  lastModified: string
  name: string
  songIds: string[]
  id: string
}

interface FullSongList {
  lastModified: string
  name: string
  songs: SongType[]
  songIds: string[]
  id: string
}

interface SongListFormType {
  id?: string
  name: string
  songs: SongType[]
}
