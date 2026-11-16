import type { Show } from '@shared/api'

/** Избранное в памяти процесса, одно на весь сервер. Ключ — id шоу. */
interface FavoriteEntry {
  show: Show
  addedAt: number
}

const favorite: Record<number, FavoriteEntry> = {}

export const listFavoriteEntries = (): FavoriteEntry[] => Object.values(favorite)

export const findFavorite = (id: number): FavoriteEntry | undefined => favorite[id]

export const saveFavorite = (show: Show, addedAt: number): void => {
  favorite[show.id] = { show, addedAt }
}

export const deleteFavorite = (id: number): void => {
  delete favorite[id]
}
