import styles from './Toast.module.css'
import { usePresenter } from './logic/usePresenter'

export default function Toast() {
  const { key, isVisible, text, close } = usePresenter()

  return (
    <div className={styles.root} role="status" aria-live="polite">
      {isVisible && (
        <button key={key} className={styles.toast} onClick={close}>
          {text}
        </button>
      )}
    </div>
  )
}
