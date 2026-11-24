import FavoritesButton from './FavoritesButton/FavoritesButton'
import Genres from './Genres/Genres'
import Pagination from './Pagination/Pagination'
import SearchBar from './SearchBar/SearchBar'
import ShowList from './ShowList/ShowList'
import UserBar from './UserBar/UserBar'
import styles from './ShowsExplorer.module.css'
import { usePresenter } from './logic/usePresenter'

export default function ShowsExplorer() {
  const { genres, visibleShows, totalPages, status, isLoading, error, retry } = usePresenter()

  return (
    <main className={styles.root}>
      <div className={styles.toolbar}>
        <UserBar />
        <FavoritesButton />
      </div>
      <h1 className={styles.title}>What are we watching today?</h1>
      <div className={styles.controls}>
        <SearchBar loading={isLoading} />
        <Genres genres={genres} />
      </div>
      <ShowList shows={visibleShows} status={status} error={error} onRetry={retry} />
      <Pagination totalPages={totalPages} />
    </main>
  )
}
