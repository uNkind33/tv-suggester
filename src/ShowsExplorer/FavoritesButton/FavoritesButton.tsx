import FavoritesPanel from './FavoritesPanel/FavoritesPanel'
import styles from './FavoritesButton.module.css'
import { usePresenter } from './logic/usePresenter'

export default function FavoritesButton() {
  const { isVisible, label, isOpen, open, close } = usePresenter()

  if (!isVisible) return null

  return (
    <div className={styles.root}>
      <button className={styles.btn} onClick={open}>
        {label}
      </button>
      {isOpen && <FavoritesPanel onClose={close} />}
    </div>
  )
}
