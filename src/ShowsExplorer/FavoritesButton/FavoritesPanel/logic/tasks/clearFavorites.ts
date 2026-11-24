import { deleteAllFavorites } from '@/api/favorites'
import { toApiErrorCode } from '@/api/httpClient'
import type { ApiErrorCode } from '@/lib/apiErrorCode'
import { useAuthStore } from '@/store/authStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { endSession } from '@/tasks/endSession'

export type ClearFavoritesResult = { error: null } | { error: ApiErrorCode }

/**
 * Очистить всё избранное. Стор очищаем сразу, не дожидаясь сервера (optimistic UI);
 * если сервер ответил ошибкой, возвращаем список. Удалённые отмечаем в `changes`,
 * чтобы поздний ответ загрузки списка их не воскресил. Если пользователь успел выйти, возвращать некому.
 */
export async function clearFavorites(): Promise<ClearFavoritesResult> {
  const email = useAuthStore.getState().user?.email
  const before = useFavoritesStore.getState()
  const removed = Object.fromEntries(before.items.map((show) => [show.id, null]))
  useFavoritesStore.setState({ items: [], changes: { ...before.changes, ...removed } })

  try {
    await deleteAllFavorites()
    return { error: null }
  } catch (error) {
    const code = toApiErrorCode(error)
    if (code === 'unauthorized') endSession() // сессия на сервере пропала: возвращать нечего
    else if (useAuthStore.getState().user?.email === email) {
      useFavoritesStore.setState({ items: before.items, changes: before.changes })
    }
    return { error: code }
  }
}
