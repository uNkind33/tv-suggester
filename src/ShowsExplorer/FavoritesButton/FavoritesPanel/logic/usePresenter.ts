import { useEffect } from 'react'
import { useFavoritesStore } from '@/store/favoritesStore'

export function usePresenter(onClose: () => void) {
  const shows = useFavoritesStore((state) => state.items)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return { isEmpty: shows.length === 0, shows }
}
