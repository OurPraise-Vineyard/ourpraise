import Fuse from 'fuse.js'

export function search(query: string, data: any[], keys: string[]): any[] {
  const fuse = new Fuse(data, {
    keys,
    includeScore: true
  })

  return fuse.search(query).map(result => result.item)
}
