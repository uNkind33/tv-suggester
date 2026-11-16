import type { Show } from '@shared/api'
import { useToggleFavorite } from '@/ShowsExplorer/logic/useToggleFavorite'

export function usePresenter(show: Show) {
  const { isFavorite, isPending, toggle } = useToggleFavorite(show)

  return {
    isFavorite,
    isPending,
    icon: isFavorite ? '★' : '☆',
    label: isFavorite ? `Remove ${show.name} from favorites` : `Add ${show.name} to favorites`,
    onToggle: toggle,
  }
}
