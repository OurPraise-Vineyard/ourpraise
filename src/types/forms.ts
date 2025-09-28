import type { IDocId } from './backend'
import type { IKey } from './models'

export type ISongForm = {
  id?: IDocId
  key: IKey
  title: string
  authors: string
  body: string
}
