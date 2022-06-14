export enum FetchStatus {
  idle = 'idle',
  loading = 'loading',
  failed = 'failed',
  succeeded = 'succeeded'
}

export function mapDocsId (snap, idField = 'id') {
  return snap.docs.map(doc => ({ ...doc.data(), [idField]: doc.id }))
}

const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function pruneObject (obj) {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) {
        if (isObject(value)) {
          return {
            ...acc,
            [key]: pruneObject(value)
          }
        }

        return {
          ...acc,
          [key]: value
        }
      }
      return acc
    },
    {}
  )
}
