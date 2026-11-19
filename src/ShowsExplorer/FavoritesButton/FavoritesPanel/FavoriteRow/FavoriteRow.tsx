import type { Show } from '@shared/api'
import styles from './FavoriteRow.module.css'
import { usePresenter } from './logic/usePresenter'

interface Props {
  show: Show
}

export default function FavoriteRow({ show }: Props) {
  const { thumbUrl, meta, removeLabel, isPending, onRemove } = usePresenter(show)

  return (
    <li className={styles.row}>
      {thumbUrl && <img className={styles.thumb} src={thumbUrl} alt="" />}
      <div className={styles.info}>
        <p className={styles.name}>{show.name}</p>
        <p className={styles.meta}>{meta}</p>
      </div>
      <button className={styles.remove} onClick={onRemove} aria-label={removeLabel} aria-busy={isPending}>
        ★
      </button>
    </li>
  )
}
