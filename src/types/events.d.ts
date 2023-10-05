interface IEventSong {
  id: IDocId
  transposeKey: IKey
  comment: string
  body?: Array<string>
  title?: string
  authors?: string
  key?: IKey
  formattedKey?: string
}

interface IEvent {
  title: string
  date: string
  songs: Array<IEventSong>
  id: IDocId
  comment: string
  createdAt: string
  owner: string
}

interface IEventForm {
  title: string
  date: string
  songs: Array<IEventSong>
  id?: IDocId
  comment: string
}
