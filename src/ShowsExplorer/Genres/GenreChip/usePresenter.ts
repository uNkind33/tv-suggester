import styles from './GenreChip.module.css'

export function usePresenter(active: boolean) {
  return { className: active ? `${styles.chip} ${styles.active}` : styles.chip }
}
