import { loadShows, type LoadShowsResult } from '@/ShowsExplorer/logic/tasks/loadShows'
import { useSearchStore } from '@/store/searchStore'

/** Выбрать жанр или снять фильтр (`null`). Страница прошлого фильтра не подходит к новому. */
export async function selectGenre(genre: string | null): Promise<LoadShowsResult> {
  if (genre === useSearchStore.getState().genre) return { error: null }

  useSearchStore.setState({ genre, page: 1 })
  return loadShows()
}
