import styles from './Toast.module.css'
import { usePresenter } from './logic/usePresenter'

export default function Toast() {
  const { key, isVisible, kind, icon, text, close } = usePresenter()

  return (
    <div className={styles.root} role="status" aria-live="polite">
      {isVisible && (
        <button key={key} className={styles.toast} data-kind={kind} onClick={close}>
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
          {text}
        </button>
      )}
    </div>
  )
}
