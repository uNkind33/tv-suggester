import { create } from 'zustand'

// Только состояние. Зависимые изменения (новый запрос сбрасывает страницу) — в tasks.
interface SearchState {
  /** Текст в поле ввода, меняется на каждый символ. */
  query: string
  /** Запрос после debounce: по нему уходит запрос на сервер. */
  term: string
  genre: string | null
  page: number
}

export const useSearchStore = create<SearchState>(() => ({
  query: '',
  term: '',
  genre: null,
  page: 1,
}))
