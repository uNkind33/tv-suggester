import styles from './StateMessage.module.css'

interface Props {
  icon: string
  title: string
  text: string
  actionLabel?: string
  onAction?: () => void
}

export default function StateMessage({ icon, title, text, actionLabel, onAction }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.icon}>{icon}</div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>
      {actionLabel && (
        <button className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
