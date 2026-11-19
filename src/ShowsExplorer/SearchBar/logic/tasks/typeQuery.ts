import { useSearchStore } from '@/store/searchStore'

/** Текст в поле ввода. Поиск по нему запускается позже, после паузы (searchByTerm). */
export function typeQuery(query: string): void {
  useSearchStore.setState({ query })
}
