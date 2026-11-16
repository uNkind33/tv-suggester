// Контракт API между frontend и backend. Единственное место, где описаны эти типы.

export interface Show {
  id: number
  name: string
  genres: string[]
  status: string
  premiered: string | null
  rating: { average: number | null }
  image: { medium: string; original: string } | null
  summary: string | null
}

/** Одна страница выдачи: уже отфильтрована по жанру и порезана на страницы. */
export interface ShowsPage {
  items: Show[]
  /** Жанры всей выдачи по запросу (до фильтрации по жанру). */
  genres: string[]
  page: number
  totalPages: number
  total: number
}

export interface Favorites {
  items: Show[]
  count: number
}

/** Код ошибки в теле ответа `{ error }`. Текст для пользователя делает клиент. */
export type ErrorCode = 'bad-request' | 'not-found' | 'upstream' | 'server'
