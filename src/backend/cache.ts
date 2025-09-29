import type { IEventSchema, ISongSchema } from '~/types'
import DatabaseCache from '~/utils/DatabaseCache'

export const eventCache = new DatabaseCache<IEventSchema>()
export const songCache = new DatabaseCache<ISongSchema>()

export const clearCache = () => {
  eventCache.clear()
  songCache.clear()
}
