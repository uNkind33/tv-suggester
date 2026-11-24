import { fetchCurrentUser } from '@/api/auth'
import { toApiErrorCode } from '@/api/httpClient'
import { getToken } from '@/api/session'
import type { ApiErrorCode } from '@/lib/apiErrorCode'
import { endSession } from '@/tasks/endSession'
import { startSession } from '@/tasks/startSession'

export type RestoreSessionResult =
  | { error: null; favoritesError: ApiErrorCode | null }
  | { error: ApiErrorCode }

/**
 * При запуске приложения: если в браузере остался токен, спросить сервер, чей он.
 * Токен, который сервер не знает (его перезапускали), молча сбрасываем: человек просто гость.
 */
export async function restoreSession(): Promise<RestoreSessionResult> {
  if (!getToken()) return { error: null, favoritesError: null }

  try {
    const user = await fetchCurrentUser()
    const { favoritesError } = await startSession(user)
    // сессия пропала между проверкой и загрузкой избранного: `endSession` уже всё сделала, человек гость
    return { error: null, favoritesError: favoritesError === 'unauthorized' ? null : favoritesError }
  } catch (error) {
    const code = toApiErrorCode(error)
    if (code !== 'unauthorized') return { error: code }

    endSession()
    return { error: null, favoritesError: null }
  }
}
