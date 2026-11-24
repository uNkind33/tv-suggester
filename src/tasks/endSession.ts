import { clearToken } from '@/api/session'
import { useAuthStore } from '@/store/authStore'
import { useFavoritesStore } from '@/store/favoritesStore'

/**
 * Забыть пользователя на клиенте: токен, `user` и всё его личное. Вызывают выход и любая task,
 * которой сервер ответил `unauthorized`. Новый личный store чистим здесь же.
 */
export function endSession(): void {
  clearToken()
  useAuthStore.setState({ user: null })
  useFavoritesStore.setState({ items: [], pendingIds: [], changes: {} })
}
