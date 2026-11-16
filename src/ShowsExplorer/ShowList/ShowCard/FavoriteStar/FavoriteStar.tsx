import type { Show } from '@shared/api'
import styles from './FavoriteStar.module.css'
import { usePresenter } from './logic/usePresenter'

interface Props {
  show: Show
}

export default function FavoriteStar({ show }: Props) {
  const { isFavorite, isPending, icon, label, onToggle } = usePresenter(show)

  return (
    <button
      className={styles.star}
      onClick={onToggle}
      aria-label={label}
      aria-pressed={isFavorite}
      aria-busy={isPending}
    >
      {icon}
    </button>
  )
}
