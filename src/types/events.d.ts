interface EventSongType {
  id: string,
  key?: string,
  title?: string,
  authors?: string,
  transpose: number,
  comment: string
}

interface EventType {
  title: string,
  date: string,
  songs: Array<EventSongType>,
  id: string,
  comment?: string,
  createdAt?: string
}
