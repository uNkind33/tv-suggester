import { useSearchStore } from '../../store/searchStore'

export function usePresenter(totalPages: number) {
  const page = useSearchStore((state) => state.page)
  const setPage = useSearchStore((state) => state.setPage)

  return {
    page,
    pages: Array.from({ length: totalPages }, (_, i) => i + 1),
    goTo: setPage,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  }
}
