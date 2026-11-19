import FavoritesPanel from './FavoritesPanel/FavoritesPanel'
import styles from './FavoritesButton.module.css'
import { usePresenter } from './logic/usePresenter'

export default function FavoritesButton() {
  const { label, isOpen, open, close } = usePresenter()

  return (
    <div className={styles.root}>
      <button className={styles.btn} onClick={open}>
        {label}
      </button>
      {isOpen && <FavoritesPanel onClose={close} />}
    </div>
  )
}
