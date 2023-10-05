interface ISongList {
  lastModified: string
  name: string
  songIds: string[]
  id: IDocId
  songs?: ISong[]
}

interface ISongListForm {
  id?: IDocId
  name: string
  songs: ISong[]
}
