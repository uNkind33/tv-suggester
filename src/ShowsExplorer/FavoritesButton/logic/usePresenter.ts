import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useFavoritesStore } from '@/store/favoritesStore'

export function usePresenter() {
  const isVisible = useAuthStore((state) => state.user !== null)
  const count = useFavoritesStore((state) => state.items.length)
  const [isOpen, setIsOpen] = useState(false)

  // избранное личное: гостю кнопки нет, а список грузит начало сессии (`startSession`)
  return {
    isVisible,
    label: `★ Favorites · ${count}`,
    isOpen: isOpen && isVisible, // сессия кончилась при открытой панели: сама она не «всплывёт» при новом входе
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}
