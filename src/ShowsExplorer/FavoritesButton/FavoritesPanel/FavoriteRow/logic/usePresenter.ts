import type { Show } from '@shared/api'
import { useToggleFavorite } from '@/ShowsExplorer/logic/useToggleFavorite'

export function usePresenter(show: Show) {
  const { isPending, toggle } = useToggleFavorite(show)

  return {
    thumbUrl: show.image?.medium ?? null,
    meta: [show.premiered?.slice(0, 4), show.genres.join(' · ')].filter(Boolean).join(' · '),
    removeLabel: `Remove ${show.name} from favorites`,
    isPending,
    onRemove: toggle,
  }
}
