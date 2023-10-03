interface IPartialEvent {
  title: string
  date: string
  songs: Array<{
    id: string
    transposeKey: Key
    comment: string
  }>
  id: string
  comment: string
  createdAt: string
  owner: string
}

interface IFullEvent {
  title: string
  date: string
  songs: Array<ISong>
  songsIndex: Record<string, ISong>
  id: string
  comment: string
  createdAt: string
  owner: string
}

interface IEventForm {
  title: string
  date: string
  songs: Array<ISong>
  id?: string
  comment: string
}
