import type { Show } from '../../../api/types'
import styles from './ShowCard.module.css'

interface Props {
  show: Show
}

export default function ShowCard({ show }: Props) {
  const year = show.premiered?.slice(0, 4)
  const rating = show.rating.average

  return (
    <article className={styles.card}>
      {show.image ? (
        <img className={styles.poster} src={show.image.original} alt={show.name} loading="lazy" />
      ) : (
        <div className={styles.placeholder}>{show.name[0]}</div>
      )}
      <div className={styles.info}>
        <h3 className={styles.name}>{show.name}</h3>
        <p className={styles.meta}>
          {year && <span>{year}</span>}
          {rating !== null && <span className={styles.rating}>★ {rating}</span>}
        </p>
        <p className={styles.genres}>{show.genres.join(' · ')}</p>
      </div>
    </article>
  )
}
