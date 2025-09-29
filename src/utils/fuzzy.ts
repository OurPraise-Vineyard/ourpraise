import Fuse from 'fuse.js'

export function search<T>(query: string, data: T[], keys: string[]): any[] {
  const fuse = new Fuse(data, {
    keys,
    shouldSort: true,
    ignoreLocation: true
  })

  return fuse.search(query).map(result => result.item)
}
