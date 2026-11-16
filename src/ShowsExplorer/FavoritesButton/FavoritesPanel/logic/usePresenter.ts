import { useEffect, useState } from 'react'
import { useFavoritesStore } from '@/store/favoritesStore'
import { showToast } from '@/tasks/showToast'
import { clearFavorites } from './tasks/clearFavorites'

/** Кнопка «Clear all» нужна, когда есть что чистить списком: для одного шоу хватает звёздочки. */
export const MIN_FAVORITES_TO_CLEAR = 2

export function usePresenter(onClose: () => void) {
  const shows = useFavoritesStore((state) => state.items)
  const [isAsking, setIsAsking] = useState(false)
  const canClear = shows.length >= MIN_FAVORITES_TO_CLEAR
  // диалог показываем, только пока есть что чистить (список мог измениться, пока он открыт)
  const isConfirmOpen = isAsking && canClear

  // пока открыт диалог, Esc закрывает его (у него свой обработчик), а не всю панель
  useEffect(() => {
    if (isConfirmOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, isConfirmOpen])

  const confirmClear = async () => {
    setIsAsking(false)
    const result = await clearFavorites()
    showToast(result.error ? 'favorites-clear-error' : 'favorites-cleared')
  }

  return {
    isEmpty: shows.length === 0,
    shows,
    canClear,
    isConfirmOpen,
    askClear: () => setIsAsking(true),
    cancelClear: () => setIsAsking(false),
    confirmClear,
  }
}
