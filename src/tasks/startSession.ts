import type { User } from '@shared/api'
import type { ApiErrorCode } from '@/lib/apiErrorCode'
import { useAuthStore } from '@/store/authStore'
import { loadFavorites } from './loadFavorites'

export interface StartSessionResult {
  favoritesError: ApiErrorCode | null
}

/** Пользователь вошёл (или найден по токену): запоминаем его и сразу подгружаем его личные данные. */
export async function startSession(user: User): Promise<StartSessionResult> {
  useAuthStore.setState({ user })
  const { error } = await loadFavorites()
  return { favoritesError: error }
}
