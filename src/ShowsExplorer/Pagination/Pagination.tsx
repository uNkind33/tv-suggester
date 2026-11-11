import styles from './Pagination.module.css'
import { usePresenter } from './usePresenter'

interface Props {
  totalPages: number
}

export default function Pagination({ totalPages }: Props) {
  const { page, pages, goTo, hasPrev, hasNext } = usePresenter(totalPages)
  if (totalPages <= 1) return null

  return (
    <nav className={styles.root} aria-label="Pages">
      <button className={styles.btn} disabled={!hasPrev} onClick={() => goTo(page - 1)}>
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`${styles.btn} ${p === page ? styles.active : ''}`}
          onClick={() => goTo(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      <button className={styles.btn} disabled={!hasNext} onClick={() => goTo(page + 1)}>
        ›
      </button>
    </nav>
  )
}
