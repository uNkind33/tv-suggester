import { useEffect, useState } from 'react'
import { useFavoritesStore } from '@/store/favoritesStore'
import { showToast } from '@/tasks/showToast'
import { loadFavorites } from './tasks/loadFavorites'

export function usePresenter() {
  const count = useFavoritesStore((state) => state.items.length)
  const [isOpen, setIsOpen] = useState(false)

  // стартовая загрузка при появлении кнопки, а не реакция на стор
  useEffect(() => {
    void loadFavorites().then(({ error }) => {
      if (error) showToast('favorites-load-error')
    })
  }, [])

  return {
    label: `★ Favorites · ${count}`,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}
