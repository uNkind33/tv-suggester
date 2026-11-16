import type { Favorites } from '@shared/api'
import { listFavoriteEntries } from '@/storage/favorite'

/** Избранное, последние добавленные — первыми. */
export function listFavorites(): Favorites {
  const items = listFavoriteEntries()
    .sort((a, b) => b.addedAt - a.addedAt)
    .map((entry) => entry.show)
  return { items, count: items.length }
}
