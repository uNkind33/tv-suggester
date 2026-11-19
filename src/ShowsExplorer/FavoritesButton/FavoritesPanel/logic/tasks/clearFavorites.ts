import { deleteAllFavorites } from '@/api/favorites'
import { type ApiErrorCode, toApiErrorCode } from '@/api/httpClient'
import { useFavoritesStore } from '@/store/favoritesStore'

export type ClearFavoritesResult = { error: null } | { error: ApiErrorCode }

/**
 * Очистить всё избранное. Стор очищаем сразу, не дожидаясь сервера (optimistic UI);
 * если сервер ответил ошибкой, возвращаем список. Удалённые отмечаем в `changes`,
 * чтобы поздний ответ загрузки списка их не воскресил.
 */
export async function clearFavorites(): Promise<ClearFavoritesResult> {
  const before = useFavoritesStore.getState()
  const removed = Object.fromEntries(before.items.map((show) => [show.id, null]))
  useFavoritesStore.setState({ items: [], changes: { ...before.changes, ...removed } })

  try {
    await deleteAllFavorites()
    return { error: null }
  } catch (error) {
    useFavoritesStore.setState({ items: before.items, changes: before.changes })
    return { error: toApiErrorCode(error) }
  }
}
