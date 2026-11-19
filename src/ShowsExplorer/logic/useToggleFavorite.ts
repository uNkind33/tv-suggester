import type { Show } from '@shared/api'
import { useFavoritesStore } from '@/store/favoritesStore'
import { showToast } from '@/tasks/showToast'
import { toggleFavorite } from './tasks/toggleFavorite'

/** Переключатель избранного для одного шоу: итог — в toast; «идёт запрос» общее для всех копий шоу на экране. */
export function useToggleFavorite(show: Show) {
  const isFavorite = useFavoritesStore((state) => state.items.some((item) => item.id === show.id))
  const isPending = useFavoritesStore((state) => state.pendingIds.includes(show.id))

  const toggle = async () => {
    // пока сервер не ответил, повторные клики (и из панели, и с карточки) игнорируем:
    // иначе запросы могут прийти не по порядку, а откат одного смешается с другим
    if (useFavoritesStore.getState().pendingIds.includes(show.id)) return
    const result = await toggleFavorite(show)

    if (result.error) return showToast('favorite-error', show.name)
    showToast(result.isFavorite ? 'favorite-added' : 'favorite-removed', show.name)
  }

  return { isFavorite, isPending, toggle }
}
