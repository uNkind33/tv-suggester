// Контракт API между frontend и backend: типы и константы. Единственное место, где они описаны.

/** Минимальная длина поискового запроса: клиент не шлёт короче, сервер отвечает 400. */
export const MIN_QUERY_LENGTH = 2

/** Самая длинная допустимая почта (RFC 5321): клиент ограничивает поле, сервер отвечает 400. */
export const MAX_EMAIL_LENGTH = 254

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

/** Текущий пользователь: у нас он целиком определяется email. */
export interface User {
  email: string
}

/** Ответ на вход: токен клиент присылает в `Authorization: Bearer`, email показывает на экране. */
export interface Session extends User {
  token: string
}

/** Код ошибки в теле ответа `{ error }`. Текст для пользователя делает клиент. */
export const ERROR_CODES = ['bad-request', 'unauthorized', 'not-found', 'upstream', 'server'] as const
export type ErrorCode = (typeof ERROR_CODES)[number]
