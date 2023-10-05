interface ISong {
  id: IDocId
  key: IKey
  title: string
  authors: string
  body: string
}

type ISongForm = ISong
