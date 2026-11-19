import { deleteFavorite } from '@/storage/favorite'

/** Если шоу в избранном нет, это не ошибка: результат тот же. */
export function removeFavorite(id: number): void {
  deleteFavorite(id)
}
