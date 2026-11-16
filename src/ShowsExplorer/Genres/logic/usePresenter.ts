import { useSearchStore } from '@/store/searchStore'
import { selectGenre } from './tasks/selectGenre'

export function usePresenter() {
  const genre = useSearchStore((state) => state.genre)

  return {
    activeGenre: genre,
    // повторный клик по активному жанру снимает фильтр
    selectGenre: (value: string) => selectGenre(value === genre ? null : value),
    resetGenre: () => selectGenre(null),
  }
}
