import type { Favorites, Show } from '@shared/api'
import { request } from './httpClient'

export const fetchFavorites = () => request<Favorites>('/api/favorites')

/** Идемпотентно: сервер сам берёт данные шоу по id. */
export const putFavorite = (id: number) =>
  request<Show>(`/api/favorites/${id}`, { method: 'PUT' })

export const deleteFavorite = (id: number) =>
  request<void>(`/api/favorites/${id}`, { method: 'DELETE' })

export const deleteAllFavorites = () => request<void>('/api/favorites', { method: 'DELETE' })
