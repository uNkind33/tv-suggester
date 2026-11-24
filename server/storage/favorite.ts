import type { Show } from '@shared/api'

/** Избранное в памяти процесса: email пользователя -> id шоу -> запись. */
interface FavoriteEntry {
  show: Show
  addedAt: number
}

const favorite: Record<string, Record<number, FavoriteEntry>> = {}

const of = (email: string): Record<number, FavoriteEntry> => (favorite[email] ??= {})

export const listFavoriteEntries = (email: string): FavoriteEntry[] => Object.values(of(email))

export const findFavorite = (email: string, id: number): FavoriteEntry | undefined => of(email)[id]

export const saveFavorite = (email: string, show: Show, addedAt: number): void => {
  of(email)[show.id] = { show, addedAt }
}

export const deleteFavorite = (email: string, id: number): void => {
  delete of(email)[id]
}

export const deleteAllFavorites = (email: string): void => {
  delete favorite[email]
}
