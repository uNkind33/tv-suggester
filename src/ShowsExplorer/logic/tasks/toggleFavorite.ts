import type { Show } from '@shared/api'
import { type ApiErrorCode, toApiErrorCode } from '@/api/httpClient'
import { deleteFavorite, putFavorite } from '@/api/favorites'
import { useFavoritesStore } from '@/store/favoritesStore'

export type ToggleFavoriteResult =
  | { error: null; isFavorite: boolean }
  | { error: ApiErrorCode }

const add = (show: Show) =>
  useFavoritesStore.setState((state) => ({
    items: state.items.some((item) => item.id === show.id) ? state.items : [show, ...state.items],
  }))

const remove = (id: number) =>
  useFavoritesStore.setState((state) => ({ items: state.items.filter((item) => item.id !== id) }))

/**
 * Добавить шоу в избранное или убрать. Стор меняем сразу, не дожидаясь сервера
 * (optimistic UI); если сервер ответил ошибкой, откатываем. Сам список хранит backend.
 */
export async function toggleFavorite(show: Show): Promise<ToggleFavoriteResult> {
  const wasFavorite = useFavoritesStore.getState().items.some((item) => item.id === show.id)

  if (wasFavorite) remove(show.id)
  else add(show)

  try {
    if (wasFavorite) await deleteFavorite(show.id)
    else await putFavorite(show.id)
    return { error: null, isFavorite: !wasFavorite }
  } catch (error) {
    if (wasFavorite) add(show)
    else remove(show.id)
    return { error: toApiErrorCode(error) }
  }
}
