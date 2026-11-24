import { postLogin } from '@/api/auth'
import { toApiErrorCode } from '@/api/httpClient'
import type { ApiErrorCode } from '@/lib/apiErrorCode'
import { setToken } from '@/api/session'
import { startSession } from '@/tasks/startSession'

export type LoginResult =
  | { error: null; favoritesError: ApiErrorCode | null }
  | { error: ApiErrorCode }

/** Войти по email: сервер выдаёт токен, дальше обычное начало сессии (user в store и его избранное). */
export async function login(email: string): Promise<LoginResult> {
  try {
    const { token, email: confirmed } = await postLogin(email)
    setToken(token)
    const { favoritesError } = await startSession({ email: confirmed })
    // сессия пропала сразу после входа: `endSession` уже сработала, вход не удался
    if (favoritesError === 'unauthorized') return { error: 'unauthorized' }
    return { error: null, favoritesError }
  } catch (error) {
    return { error: toApiErrorCode(error) }
  }
}
