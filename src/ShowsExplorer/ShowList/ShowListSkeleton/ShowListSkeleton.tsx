import styles from './ShowListSkeleton.module.css'

export default function ShowListSkeleton() {
  return (
    <ul className={styles.grid} aria-busy="true" aria-label="Загрузка">
      {[0, 1, 2].map((i) => (
        <li key={i} className={styles.card} />
      ))}
    </ul>
  )
}
