import { useSearchStore } from '@/store/searchStore'
import { goToPage } from './tasks/goToPage'

export function usePresenter(totalPages: number) {
  const page = useSearchStore((state) => state.page)

  return {
    page,
    pages: Array.from({ length: totalPages }, (_, i) => i + 1),
    goTo: goToPage,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  }
}
