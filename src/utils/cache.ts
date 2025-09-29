export class DatabaseCache<T> {
  _cache: {
    collections: Map<string, string[]>
    documents: Map<string, T>
  }

  constructor() {
    this._cache = {
      collections: new Map(),
      documents: new Map()
    }
  }

  setCollection(key: string, collection: string[]) {
    this._cache.collections.set(key, collection)
  }

  deleteCollection(key: string) {
    this._cache.collections.delete(key)
  }

  getCollection(key: string) {
    const collection = this._cache.collections.get(key)

    if (collection) {
      return collection
        .map(id => this._cache.documents.get(id))
        .filter(Boolean) as T[]
    }

    return []
  }

  setDocument(key: string, document: T) {
    this._cache.documents.set(key, document)
  }

  deleteDocument(key: string) {
    this._cache.documents.delete(key)
  }

  getDocument(key: string) {
    return this._cache.documents.get(key)
  }
}
