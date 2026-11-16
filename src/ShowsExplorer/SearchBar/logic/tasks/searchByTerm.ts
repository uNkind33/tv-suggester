import { loadShows, type LoadShowsResult } from '@/ShowsExplorer/logic/tasks/loadShows'
import { useSearchStore } from '@/store/searchStore'
import { useShowsStore } from '@/store/showsStore'

/**
 * Искать по новому запросу. Жанр и страница от прошлой выдачи теряют смысл, поэтому
 * сбрасываются. Тот же запрос повторяем, только если он упал.
 */
export async function searchByTerm(term: string): Promise<LoadShowsResult> {
  const isSameTerm = term === useSearchStore.getState().term
  if (isSameTerm && useShowsStore.getState().status !== 'error') return { error: null }

  useSearchStore.setState({ term, genre: null, page: 1 })
  return loadShows()
}
