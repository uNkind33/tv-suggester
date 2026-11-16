import styles from './ConfirmDialog.module.css'
import { usePresenter } from './logic/usePresenter'

interface Props {
  count: number
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ count, onConfirm, onCancel }: Props) {
  const { title } = usePresenter(count, onCancel)

  return (
    <>
      <div className={styles.overlay} onClick={onCancel} />
      <div className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <button className={styles.close} onClick={onCancel} aria-label="Close">
          ✕
        </button>
        <h3 id="confirm-title" className={styles.title}>
          {title}
        </h3>
        <p className={styles.text}>This can’t be undone.</p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </>
  )
}
