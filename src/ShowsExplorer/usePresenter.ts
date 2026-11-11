import { useMemo } from 'react'
import { extractGenres, filterByGenre } from '@/lib/genres'
import { pageCount, paginate } from '@/lib/paginate'
import { useSearchStore } from '@/store/searchStore'
import { useShows } from './useShows'

export function usePresenter() {
  const { shows, status, error, retry } = useShows()
  const genre = useSearchStore((state) => state.genre)
  const page = useSearchStore((state) => state.page)

  const genres = useMemo(() => extractGenres(shows), [shows])
  const filtered = useMemo(() => filterByGenre(shows, genre), [shows, genre])

  return {
    genres,
    visibleShows: paginate(filtered, page),
    totalPages: pageCount(filtered.length),
    status,
    error,
    retry,
  }
}
