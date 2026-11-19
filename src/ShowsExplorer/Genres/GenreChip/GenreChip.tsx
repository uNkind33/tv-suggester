import styles from './GenreChip.module.css'

interface Props {
  label: string
  active: boolean
  onClick: () => void
}

export default function GenreChip({ label, active, onClick }: Props) {
  return (
    <button className={styles.chip} onClick={onClick} aria-pressed={active}>
      {label}
    </button>
  )
}
