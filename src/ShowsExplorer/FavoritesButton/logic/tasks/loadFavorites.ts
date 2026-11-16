import { fetchFavorites } from '@/api/favorites'
import { type ApiErrorCode, toApiErrorCode } from '@/api/httpClient'
import { useFavoritesStore } from '@/store/favoritesStore'

export interface LoadFavoritesResult {
  error: ApiErrorCode | null
}

/**
 * Загрузить список избранного с сервера. Пока он грузился, пользователь мог кликнуть звёздочку:
 * такие изменения (`changes`) важнее ответа, который мог быть собран до них.
 */
export async function loadFavorites(): Promise<LoadFavoritesResult> {
  useFavoritesStore.setState({ changes: {} })
  try {
    const { items } = await fetchFavorites()
    const { changes } = useFavoritesStore.getState()

    const merged = items.filter((show) => changes[show.id] !== null)
    for (const show of Object.values(changes)) {
      if (show && !merged.some((item) => item.id === show.id)) merged.unshift(show)
    }
    useFavoritesStore.setState({ items: merged })
    return { error: null }
  } catch (error) {
    return { error: toApiErrorCode(error) }
  }
}
