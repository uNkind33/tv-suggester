import { useSearchStore } from '@/store/searchStore'
import { selectGenre } from './tasks/selectGenre'

export function usePresenter(genres: string[]) {
  const genre = useSearchStore((state) => state.genre)

  return {
    isVisible: genres.length > 0,
    isAllActive: genre === null,
    resetGenre: () => selectGenre(null),
    chips: genres.map((name) => ({
      name,
      isActive: name === genre,
      // повторный клик по активному жанру снимает фильтр
      onSelect: () => selectGenre(name === genre ? null : name),
    })),
  }
}
