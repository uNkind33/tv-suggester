import type { Favorites } from '@shared/api'
import { listFavoriteEntries } from '@/storage/favorite'

/** Избранное пользователя, последние добавленные — первыми. */
export function listFavorites(email: string): Favorites {
  const items = listFavoriteEntries(email)
    .sort((a, b) => b.addedAt - a.addedAt)
    .map((entry) => entry.show)
  return { items, count: items.length }
}
