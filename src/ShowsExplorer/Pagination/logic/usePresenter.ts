import { useSearchStore } from '@/store/searchStore'
import { goToPage } from './tasks/goToPage'

export function usePresenter(totalPages: number) {
  const page = useSearchStore((state) => state.page)

  return {
    isVisible: totalPages > 1,
    hasPrev: page > 1,
    hasNext: page < totalPages,
    goPrev: () => goToPage(page - 1),
    goNext: () => goToPage(page + 1),
    pages: Array.from({ length: totalPages }, (_, i) => ({
      value: i + 1,
      ariaCurrent: i + 1 === page ? ('page' as const) : undefined,
      goTo: () => goToPage(i + 1),
    })),
  }
}
