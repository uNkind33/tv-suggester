import { useSearchStore } from '@/store/searchStore'

export function usePresenter() {
  const genre = useSearchStore((state) => state.genre)
  const setGenre = useSearchStore((state) => state.setGenre)

  return {
    activeGenre: genre,
    selectGenre: (value: string) => setGenre(value === genre ? null : value),
    resetGenre: () => setGenre(null),
  }
}
