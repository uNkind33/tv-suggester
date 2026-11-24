import { fetchFavorites } from '@/api/favorites'
import { toApiErrorCode } from '@/api/httpClient'
import type { ApiErrorCode } from '@/lib/apiErrorCode'
import { useAuthStore } from '@/store/authStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { endSession } from './endSession'

export interface LoadFavoritesResult {
  error: ApiErrorCode | null
}

/**
 * Загрузить список избранного текущего пользователя. Гостю грузить нечего. Пока список грузился,
 * пользователь мог кликнуть звёздочку: такие изменения (`changes`) важнее ответа, который мог
 * быть собран до них. Если за это время вошёл другой пользователь, чужой ответ выбрасываем.
 */
export async function loadFavorites(): Promise<LoadFavoritesResult> {
  const email = useAuthStore.getState().user?.email
  if (!email) return { error: null }

  useFavoritesStore.setState({ changes: {} })
  try {
    const { items } = await fetchFavorites()
    if (useAuthStore.getState().user?.email !== email) return { error: null }
    const { changes } = useFavoritesStore.getState()

    const merged = items.filter((show) => changes[show.id] !== null)
    for (const show of Object.values(changes)) {
      if (show && !merged.some((item) => item.id === show.id)) merged.unshift(show)
    }
    // изменения учтены в `merged`: дальше копить их незачем
    useFavoritesStore.setState({ items: merged, changes: {} })
    return { error: null }
  } catch (error) {
    const code = toApiErrorCode(error)
    if (code === 'unauthorized') endSession()
    return { error: code }
  }
}
