import styles from './SearchBar.module.css'
import { usePresenter } from './usePresenter'

interface Props {
  loading: boolean
}

export default function SearchBar({ loading }: Props) {
  const { query, onChange, onClear } = usePresenter()

  return (
    <div className={styles.root}>
      <input
        className={styles.input}
        value={query}
        onChange={onChange}
        placeholder="Search shows: murder, banana, breaking…"
        aria-label="Search shows"
        autoFocus
      />
      {query && (
        <button className={styles.clear} onClick={onClear} aria-label="Clear">
          ✕
        </button>
      )}
      {loading && <span className={styles.loader} />}
    </div>
  )
}
