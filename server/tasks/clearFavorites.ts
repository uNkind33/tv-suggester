import { deleteAllFavorites } from '@/storage/favorite'

/** Очистить всё избранное пользователя. Если оно уже пустое, это не ошибка. */
export function clearFavorites(email: string): void {
  deleteAllFavorites(email)
}
