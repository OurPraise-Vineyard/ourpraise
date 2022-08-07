interface PartialEvent {
  title: string,
  date: string,
  songs: Array<{
    id: string,
    transpose: number,
    comment: string
  }>,
  id: string,
  comment: string,
  createdAt: string,
  organisation: string
  owner: string
}

interface FullEvent {
  title: string,
  date: string,
  songs: Array<SongType>,
  songsIndex: Record<string, SongType>,
  id: string,
  comment: string,
  createdAt: string,
  organisation: string
  organisationName: string,
  owner: string
}

interface EventFormType {
  title: string,
  date: string,
  songs: Array<EventSongType>,
  id?: string,
  comment: string,
  organisation: string
}
