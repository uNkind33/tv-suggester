import GenreChip from './GenreChip/GenreChip'
import styles from './Genres.module.css'
import { usePresenter } from './usePresenter'

interface Props {
  genres: string[]
}

export default function Genres({ genres }: Props) {
  const { activeGenre, selectGenre, resetGenre } = usePresenter()
  if (genres.length === 0) return null

  return (
    <div className={styles.root}>
      <GenreChip label="Все" active={activeGenre === null} onClick={resetGenre} />
      {genres.map((genre) => (
        <GenreChip
          key={genre}
          label={genre}
          active={genre === activeGenre}
          onClick={() => selectGenre(genre)}
        />
      ))}
    </div>
  )
}
