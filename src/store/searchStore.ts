import { create } from 'zustand'

interface SearchState {
  query: string
  genre: string | null
  page: number
  setQuery: (query: string) => void
  setGenre: (genre: string | null) => void
  setPage: (page: number) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  genre: null,
  page: 1,
  // смена запроса или жанра всегда возвращает на первую страницу
  setQuery: (query) => set({ query, genre: null, page: 1 }),
  setGenre: (genre) => set({ genre, page: 1 }),
  setPage: (page) => set({ page }),
}))
