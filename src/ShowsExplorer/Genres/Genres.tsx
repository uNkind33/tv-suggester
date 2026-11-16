import GenreChip from './GenreChip/GenreChip'
import styles from './Genres.module.css'
import { usePresenter } from './logic/usePresenter'

interface Props {
  genres: string[]
}

export default function Genres({ genres }: Props) {
  const { isVisible, isAllActive, resetGenre, chips } = usePresenter(genres)
  if (!isVisible) return null

  return (
    <div className={styles.root}>
      <GenreChip label="All" active={isAllActive} onClick={resetGenre} />
      {chips.map((chip) => (
        <GenreChip
          key={chip.name}
          label={chip.name}
          active={chip.isActive}
          onClick={chip.onSelect}
        />
      ))}
    </div>
  )
}
