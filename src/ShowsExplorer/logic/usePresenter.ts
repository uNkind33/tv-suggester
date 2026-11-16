import { useShowsStore } from '@/store/showsStore'
import { loadShows } from './tasks/loadShows'

export function usePresenter() {
  const data = useShowsStore((state) => state.data)
  const status = useShowsStore((state) => state.status)
  const error = useShowsStore((state) => state.error)

  return {
    genres: data?.genres ?? [],
    visibleShows: data?.items ?? [],
    totalPages: data?.totalPages ?? 1,
    status,
    error,
    retry: () => loadShows(),
  }
}
