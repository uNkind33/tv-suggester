import { postLogout } from '@/api/auth'
import { endSession } from '@/tasks/endSession'

export type LogoutResult = { error: null }

/**
 * Выйти. Сначала просим сервер забыть токен, но локальный выход от ответа не зависит:
 * недоступный сервер не должен держать человека «вошедшим». Забытый на сервере токен ничего
 * не откроет, пока его не знает клиент.
 */
export async function logout(): Promise<LogoutResult> {
  try {
    await postLogout()
  } catch {
    // сервер недоступен или сессии уже нет: итог один
  }
  endSession()
  return { error: null }
}
