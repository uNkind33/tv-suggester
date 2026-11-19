import { loadShows, type LoadShowsResult } from '@/ShowsExplorer/logic/tasks/loadShows'
import { useSearchStore } from '@/store/searchStore'
import { useShowsStore } from '@/store/showsStore'

/** Перейти на страницу выдачи. Номер за пределами выдачи прижимаем к краю. */
export async function goToPage(page: number): Promise<LoadShowsResult> {
  const totalPages = useShowsStore.getState().data?.totalPages ?? 1
  const nextPage = Math.min(Math.max(page, 1), totalPages)
  if (nextPage === useSearchStore.getState().page) return { error: null }

  useSearchStore.setState({ page: nextPage })
  return loadShows()
}
