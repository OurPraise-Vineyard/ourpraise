type IEventSong = {
  id: IDocId
  transposeKey: IKey
  comment: string
  body?: Array<string>
  title?: string
  authors?: string
  key?: IKey
  formattedKey?: string
}

type IEventSongForm = {
  id: IDocId
  transposeKey: IKey
  comment: string
}

type IEvent = {
  title: string
  date: string
  group: string
  songs: Array<IEventSong>
  id: IDocId
  comment: string
  createdAt: string
  owner: string
}

type IEventForm = {
  title: string
  date: string
  group: string
  songs: Array<IEventSong>
  id?: IDocId
  comment: string
  owner: string
}
