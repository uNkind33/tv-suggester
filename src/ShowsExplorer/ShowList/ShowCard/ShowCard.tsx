import type { Show } from '@shared/api'
import FavoriteStar from './FavoriteStar/FavoriteStar'
import styles from './ShowCard.module.css'
import { usePresenter } from './logic/usePresenter'

interface Props {
  show: Show
}

export default function ShowCard({ show }: Props) {
  const { posterUrl, initial, year, ratingLabel, genresLabel } = usePresenter(show)

  return (
    <article className={styles.card}>
      <FavoriteStar show={show} />
      {posterUrl ? (
        <img className={styles.poster} src={posterUrl} alt={show.name} loading="lazy" />
      ) : (
        <div className={styles.placeholder}>{initial}</div>
      )}
      <div className={styles.info}>
        <h3 className={styles.name}>{show.name}</h3>
        <p className={styles.meta}>
          {year && <span>{year}</span>}
          {ratingLabel && <span className={styles.rating}>{ratingLabel}</span>}
        </p>
        <p className={styles.genres}>{genresLabel}</p>
      </div>
    </article>
  )
}
