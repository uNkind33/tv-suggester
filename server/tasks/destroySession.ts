import { deleteSession } from '@/storage/sessions'

/** Выход. Если сессии уже нет, это не ошибка: результат тот же. */
export function destroySession(token: string): void {
  deleteSession(token)
}
