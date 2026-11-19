import { deleteAllFavorites } from '@/storage/favorite'

/** Очистить всё избранное. Если оно уже пустое, это не ошибка. */
export function clearFavorites(): void {
  deleteAllFavorites()
}
