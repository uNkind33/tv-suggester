import { deleteFavorite } from '@/storage/favorite'

/** Если шоу в избранном нет, это не ошибка: результат тот же. */
export function removeFavorite(email: string, id: number): void {
  deleteFavorite(email, id)
}
