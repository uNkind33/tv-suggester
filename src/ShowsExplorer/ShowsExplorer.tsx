import Genres from './Genres/Genres'
import Pagination from './Pagination/Pagination'
import SearchBar from './SearchBar/SearchBar'
import ShowList from './ShowList/ShowList'
import styles from './ShowsExplorer.module.css'
import { usePresenter } from './usePresenter'

export default function ShowsExplorer() {
  const { genres, visibleShows, totalPages, status, error, retry } = usePresenter()

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>What are we watching today?</h1>
      <SearchBar loading={status === 'loading'} />
      <Genres genres={genres} />
      <ShowList shows={visibleShows} status={status} error={error} onRetry={retry} />
      <Pagination totalPages={totalPages} />
    </main>
  )
}
