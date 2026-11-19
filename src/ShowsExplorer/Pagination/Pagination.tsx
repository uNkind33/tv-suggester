import styles from './Pagination.module.css'
import { usePresenter } from './logic/usePresenter'

interface Props {
  totalPages: number
}

export default function Pagination({ totalPages }: Props) {
  const { isVisible, hasPrev, hasNext, goPrev, goNext, pages } = usePresenter(totalPages)
  if (!isVisible) return null

  return (
    <nav className={styles.root} aria-label="Pages">
      <button className={styles.btn} disabled={!hasPrev} onClick={goPrev}>
        ‹
      </button>
      {pages.map((p) => (
        <button key={p.value} className={styles.btn} onClick={p.goTo} aria-current={p.ariaCurrent}>
          {p.value}
        </button>
      ))}
      <button className={styles.btn} disabled={!hasNext} onClick={goNext}>
        ›
      </button>
    </nav>
  )
}
