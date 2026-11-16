import { fetchFavorites } from '@/api/favorites'
import { type ApiErrorCode, toApiErrorCode } from '@/api/httpClient'
import { useFavoritesStore } from '@/store/favoritesStore'

export interface LoadFavoritesResult {
  error: ApiErrorCode | null
}

export async function loadFavorites(): Promise<LoadFavoritesResult> {
  try {
    const { items } = await fetchFavorites()
    useFavoritesStore.setState({ items })
    return { error: null }
  } catch (error) {
    return { error: toApiErrorCode(error) }
  }
}
