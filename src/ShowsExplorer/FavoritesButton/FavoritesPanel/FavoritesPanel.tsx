import FavoriteRow from './FavoriteRow/FavoriteRow'
import styles from './FavoritesPanel.module.css'
import { usePresenter } from './logic/usePresenter'

interface Props {
  onClose: () => void
}

export default function FavoritesPanel({ onClose }: Props) {
  const { isEmpty, shows } = usePresenter(onClose)

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.panel} role="dialog" aria-label="Favorites">
        <header className={styles.header}>
          <h2 className={styles.title}>Favorites</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        {isEmpty ? (
          <p className={styles.empty}>No favorites yet. Tap ☆ on a show to add it.</p>
        ) : (
          <ul className={styles.list}>
            {shows.map((show) => (
              <FavoriteRow key={show.id} show={show} />
            ))}
          </ul>
        )}
      </aside>
    </>
  )
}
