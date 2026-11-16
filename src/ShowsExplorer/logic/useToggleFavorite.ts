import type { Show } from '@shared/api'
import { useState } from 'react'
import { useFavoritesStore } from '@/store/favoritesStore'
import { showToast } from '@/tasks/showToast'
import { toggleFavorite } from './tasks/toggleFavorite'

/** Переключатель избранного для одного шоу: состояние клика локальное, итог — в toast. */
export function useToggleFavorite(show: Show) {
  const isFavorite = useFavoritesStore((state) => state.items.some((item) => item.id === show.id))
  const [isPending, setIsPending] = useState(false)

  const toggle = async () => {
    // пока сервер не ответил, повторные клики игнорируем: откат одного запроса не должен смешаться с другим
    if (isPending) return
    setIsPending(true)
    const result = await toggleFavorite(show)
    setIsPending(false)

    if (result.error) return showToast('favorite-error', show.name)
    showToast(result.isFavorite ? 'favorite-added' : 'favorite-removed', show.name)
  }

  return { isFavorite, isPending, toggle }
}
