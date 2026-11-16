import type { Show } from '@shared/api'
import { deleteFavorite, putFavorite } from '@/api/favorites'
import { type ApiErrorCode, toApiErrorCode } from '@/api/httpClient'
import { useFavoritesStore } from '@/store/favoritesStore'

export type ToggleFavoriteResult =
  | { error: null; isFavorite: boolean }
  | { error: ApiErrorCode }

const add = (show: Show) =>
  useFavoritesStore.setState((state) => ({
    items: state.items.some((item) => item.id === show.id) ? state.items : [show, ...state.items],
    changes: { ...state.changes, [show.id]: show },
  }))

const remove = (id: number) =>
  useFavoritesStore.setState((state) => ({
    items: state.items.filter((item) => item.id !== id),
    changes: { ...state.changes, [id]: null },
  }))

const setPending = (id: number, isPending: boolean) =>
  useFavoritesStore.setState((state) => ({
    pendingIds: isPending ? [...state.pendingIds, id] : state.pendingIds.filter((p) => p !== id),
  }))

/**
 * Добавить шоу в избранное или убрать. Стор меняем сразу, не дожидаясь сервера
 * (optimistic UI); если сервер ответил ошибкой, откатываем. Сам список хранит backend.
 * Пока запрос по шоу идёт, его id лежит в `pendingIds`: вызывающий не должен стартовать второй.
 */
export async function toggleFavorite(show: Show): Promise<ToggleFavoriteResult> {
  const wasFavorite = useFavoritesStore.getState().items.some((item) => item.id === show.id)

  setPending(show.id, true)
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
  } finally {
    setPending(show.id, false)
  }
}
