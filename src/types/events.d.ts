interface EventType {
  title: string,
  date: string,
  songs: Array<SongType | EventSongType>,
  id: string,
  comment?: string,
  createdAt?: string
}
